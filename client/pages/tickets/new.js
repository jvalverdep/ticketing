import { useState } from "react";
import Router from "next/router";
import { validate } from "../../helpers/number";
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    onSuccess: () => Router.push("/"),
  });

  const onChangePrice = (event) => {
    if (!validate.isOnlyNumbers(event.target.value)) return;

    setPrice(event.target.value);
  };

  const onBlurPrice = (event) => {
    const value = parseFloat(event.target.value);

    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest({
      title,
      price,
    });
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form className="row" onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            value={price}
            onChange={onChangePrice}
            onBlur={onBlurPrice}
            className="form-control"
          />
        </div>
        {errors}
        <div className="mb-3">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTicket;
