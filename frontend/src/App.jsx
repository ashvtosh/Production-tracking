import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [orders, setOrders] = useState([])
  const [newOrder, setNewOrder] = useState({ product_name: '', quantity: '' })
  const API_URL = "https://production-tracking-two.vercel.app/"
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`)
      setOrders(res.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if(!newOrder.product_name || !newOrder.quantity) return;
    
    try {
      await axios.post(`${API_URL}/orders`, newOrder)
      setNewOrder({ product_name: '', quantity: '' })
      fetchOrders()
    } catch (error) {
      console.error("Error creating order:", error)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/orders/${id}`, { status: newStatus })
      fetchOrders()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  return (
    <div className="container">
      <h1>Production Order Tracker</h1>

      <div className="card">
        <h3>Create New Order</h3>
        <form onSubmit={handleCreate}>
          <input 
            type="text" 
            placeholder="Product Name" 
            value={newOrder.product_name}
            onChange={(e) => setNewOrder({...newOrder, product_name: e.target.value})}
          />
          <input 
            type="number" 
            placeholder="Quantity" 
            value={newOrder.quantity}
            onChange={(e) => setNewOrder({...newOrder, quantity: parseInt(e.target.value)})}
          />
          <button type="submit">Add Order</button>
        </form>
      </div>

      <h3>Order List</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.product_name}</td>
              <td>{order.quantity}</td>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>
                {order.status !== 'Completed' && (
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App