/**
 * Redis Service with Supabase fallback
 * Stores temporary payment sessions
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
}

/**
 * Simple Redis-like interface using Supabase as backend
 * In production, replace with actual Redis (Upstash, Redis Cloud, etc.)
 */
class RedisService {
    private useSupabase = true; // Toggle to true to use Supabase, false for in-memory (dev only)
    private memoryStore = new Map<string, { value: string; expiresAt: number }>();
    
    private get supabase(): SupabaseClient | null {
        return supabaseClient;
    }

    /**
     * Set a key with expiration time (in seconds)
     */
    async setex(key: string, expirationSeconds: number, value: string): Promise<void> {
        if (this.useSupabase && this.supabase) {
            const expiresAt = new Date(Date.now() + expirationSeconds * 1000).toISOString();
            
            // Upsert to handle duplicate keys
            const { error } = await this.supabase
                .from('pending_payments')
                .upsert({
                    session_id: key,
                    data: JSON.parse(value) as Record<string, unknown>,
                    expires_at: expiresAt,
                }, {
                    onConflict: 'session_id'
                });

            if (error) {
                console.error('Redis setex error (Supabase):', error);
                throw new Error('Failed to store pending payment');
            }
        } else {
            // In-memory fallback (dev only - not persistent)
            this.memoryStore.set(key, {
                value,
                expiresAt: Date.now() + expirationSeconds * 1000
            });
        }
    }

    /**
     * Get value by key
     */
    async get(key: string): Promise<string | null> {
        if (this.useSupabase && this.supabase) {
            const { data, error } = await this.supabase
                .from('pending_payments')
                .select('data, expires_at')
                .eq('session_id', key)
                .single();

            if (error || !data) {
                return null;
            }

            // Check if expired
            if (new Date(data.expires_at as string) < new Date()) {
                await this.del(key);
                return null;
            }

            return JSON.stringify(data.data);
        } else {
            // In-memory fallback
            const item = this.memoryStore.get(key);
            if (!item) return null;

            // Check expiration
            if (item.expiresAt < Date.now()) {
                this.memoryStore.delete(key);
                return null;
            }

            return item.value;
        }
    }

    /**
     * Delete a key
     */
    async del(key: string): Promise<void> {
        if (this.useSupabase && this.supabase) {
            await this.supabase
                .from('pending_payments')
                .delete()
                .eq('session_id', key);
        } else {
            this.memoryStore.delete(key);
        }
    }

    /**
     * Clean up expired entries (call periodically)
     */
    async cleanup(): Promise<void> {
        if (this.useSupabase && this.supabase) {
            await this.supabase
                .from('pending_payments')
                .delete()
                .lt('expires_at', new Date().toISOString());
        } else {
            const now = Date.now();
            for (const [key, item] of this.memoryStore.entries()) {
                if (item.expiresAt < now) {
                    this.memoryStore.delete(key);
                }
            }
        }
    }
}

export const redis = new RedisService();
