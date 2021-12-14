import { Elements } from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkout-form";
import Modal from "./modal";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51K4SC7GieOYPdQpZiI9SoCKMXJCcoYJO1AM68zbmCvmPSlYuN6hPfkbt2L0qChTo4jOMAewWhUWm71E7p2EF4LtD00DvnvcC01"
);

const CheckoutModal = ({ secret, isOpen, onClose, orderId }) => {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: secret,
  };

  return (
    <Modal title="Check out" isOpen={isOpen} onClose={onClose}>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm orderId={orderId} clientSecret={options.clientSecret} />
      </Elements>
    </Modal>
  );
};

export default CheckoutModal;
