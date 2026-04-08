-- 003_unique_transaction_id_orders.sql
-- Ensure payment callbacks are idempotent at the database level.
-- This creates a partial unique index so multiple NULL transaction_id rows remain allowed.

CREATE UNIQUE INDEX IF NOT EXISTS orders_transaction_id_unique_idx
ON public.orders (transaction_id)
WHERE transaction_id IS NOT NULL;
