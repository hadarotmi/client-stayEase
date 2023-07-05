import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

function PayPalCheckout() {
    return (
        <div className="App-body">

          <PayPalScriptProvider
            // options={{ "client-id": import.meta.env.VITE_CLIENT_ID }}
          >
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: "13.99",
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                const name = details.payer.name.given_name;
                alert("Transaction completed by " + name);
              }}
            />
          </PayPalScriptProvider>
        </div>
      );
    }

export default PayPalCheckout


