import React from "react";

const Alert = () => {
  const [showAlert, setShowAlert] = React.useState(true);
  return (
    <>
      {showAlert ? (
        <div
          className={
            "text-white px-6 py-4 border-0 rounded relative mb-4 bg-green-500"
          }
        >
         
          <span className="inline-block align-middle mr-8">
            <b className="capitalize">Thank You !</b> You have successfully to Mint.
          </span>
          <button
            className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
            onClick={() => setShowAlert(false)}
          >
            <span>×</span>
          </button>
        </div>
      ) : null}
    </>
  );
};

export default function ClosingAlert() {
    return (
      <>
        return <Alert  />;
      </>
    );
  }
