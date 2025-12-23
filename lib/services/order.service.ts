import { createClient } from '@supabase/supabase-js';
import type { CreateOrderData, Order } from '@/lib/types/order.types';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side operations
);

export class OrderService {
    /**
     * Generate unique order number
     */
    static generateOrderNumber(): string {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `CMD-${year}-${random}`;
    }

    /**
     * Create order in database
     * AC2: Creates order when payment callback is successful
     */
    static async createOrder(data: Omit<CreateOrderData, 'orderNumber'>): Promise<Order> {
        try {
            const orderNumber = this.generateOrderNumber();

            // Insert order into database
            const { data: order, error } = await supabase
                .from('orders')
                .insert({
                    order_number: orderNumber,
                    customer_name: data.customerName,
                    customer_phone: data.customerPhone,
                    model_id: data.modelId,
                    fabric_id: data.fabricId,
                    measurements: data.measurements || null,
                    appointment_date: data.appointmentDate || null,
                    location: data.location,
                    specific_location: data.specificLocation || null,
                    total_amount: data.totalAmount,
                    paid_amount: data.paidAmount,
                    payment_status: data.paymentStatus,
                    payment_type: data.paymentType,
                    status: data.status,
                })
                .select()
                .single();

            if (error) {
                console.error('Database error creating order:', error);
                throw new Error('Failed to create order in database');
            }

            return order as Order;
        } catch (error) {
            console.error('Order creation error:', error);
            throw error;
        }
    }

    /**
     * Get order by order number
     */
    static async getOrderByNumber(orderNumber: string): Promise<Order | null> {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('order_number', orderNumber)
                .single();

            if (error) {
                console.error('Error fetching order:', error);
                return null;
            }

            return data as Order;
        } catch (error) {
            console.error('Get order error:', error);
            return null;
        }
    }

    /**
     * Update order payment status
     */
    static async updatePaymentStatus(
        orderNumber: string,
        paymentStatus: 'pending' | 'partial' | 'paid',
        paidAmount: number
    ): Promise<void> {
        try {
            const { error } = await supabase
                .from('orders')
                .update({
                    payment_status: paymentStatus,
                    paid_amount: paidAmount,
                    updated_at: new Date().toISOString(),
                })
                .eq('order_number', orderNumber);

            if (error) {
                console.error('Error updating payment status:', error);
                throw new Error('Failed to update payment status');
            }
        } catch (error) {
            console.error('Update payment status error:', error);
            throw error;
        }
    }
}
