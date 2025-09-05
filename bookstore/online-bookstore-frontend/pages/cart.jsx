// pages/cart.jsx
import Layout from '@/layouts/Layout';
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import { useSelector } from 'react-redux';

export default function CartPage() {
  const cartItems = useSelector(state => state.cart.items);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map(item => <CartItem key={item.id} item={item} />)
          )}
        </div>
        <OrderSummary />
      </div>
    </Layout>
  );
}
