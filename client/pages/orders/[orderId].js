import { useEffect, useState } from "react";
import CheckoutModal from "../../components/checkout-modal";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order }) => {
  const [timeleft, setTimeleft] = useState(0);
  const [secret, setSecret] = useState("");
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const { doRequest, errors } = useRequest({
    url: "/api/payments/secret",
    method: "post",
    onSuccess: ({ clientSecret }) => {
      setSecret(clientSecret);
      setCheckoutModalOpen(true);
    },
  });

  useEffect(() => {
    const getTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeleft(Math.round(msLeft / 1000));
    };

    getTimeLeft();
    const timerId = setInterval(getTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const onCheckout = () => {
    const data = {
      amount: order.ticket.price,
      orderId: order.id,
    };

    doRequest(data);
  };

  if (timeleft <= 0) {
    return <p>Sorry, but the order has expired!</p>;
  }
  return (
    <div>
      <h1>{order.ticket.title}</h1>
      <h4>Price: $ {order.ticket.price}</h4>
      <h5>You only have {timeleft} seconds </h5>
      <div>
        <button onClick={onCheckout}>Pay here!</button>
      </div>
      {errors}
      <CheckoutModal
        secret={secret}
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        orderId={order.id}
      />
    </div>
  );
};

OrderShow.getInitialProps = async ({ context, client }) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return {
    order: data,
  };
};

export default OrderShow;
