import axios from "axios";
import { useState } from "react";

/**
 * useRequest function that allows to run some axios
 * @param {Object} requestParams Request's params
 * @param {string} requestParams.url
 * @param {string} requestParams.method
 * @param {Function} requestParams.onSuccess Function to run if succeded
 */
const useRequest = ({ url, method, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (body) => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      onSuccess && onSuccess(response.data);
      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err, key) => (
              <li key={key}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
