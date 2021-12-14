import Link from "next/link";

const Orders = ({ currentUser, orders }) => {
  const orderList = orders.map((order) => {
    return (
      <tr key={order.id}>
        <td>{order.status}</td>
        <td>{order.ticket.price}</td>
        <td>
          <Link href={"/tickets/[ticketId]"} as={`/tickets/${order.ticket.id}`}>
            <a>{order.ticket.id}</a>
          </Link>
        </td>
        <td>
          <Link href={"/orders/[orderId]"} as={`/orders/${order.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>List of Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Total</th>
            <th>Ticket</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
};

Orders.getInitialProps = async ({ client }) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default Orders;
