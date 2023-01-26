import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { verifyKhaltiPayment } from "../../../apis/eventApis";

//icon imports
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

const Paymentverify = () => {
  const khaltiPaymentDetails = {};
  const navigate = useNavigate();
  const queryCLient = useQueryClient();
  //paymentVerificationKhalti query
  const {
    isLoading: ispaymentVerificationKhaltiLoading,
    data: paymentVerificationKhalti,
    isError: ispaymentVerificationKhaltiError,
    error: paymentVerificationKhaltiError,
    isFetching: ispaymentVerificationKhaltiFetching,
    refetch: refetchpaymentVerificationKhalti,
  } = useQuery(
    "paymentVerificationKhalti",

    () => verifyKhaltiPayment(khaltiPaymentDetails),
    {
      enabled: false,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (paymentVerificationKhalti) => {
        showNotification({
          title: "Payment Verified",
          message: "Redirecting to Payments",
          color: "green",
        });
        queryCLient.invalidateQueries("payments", "allEvents");
        navigate("/dashboard/payments");
      },
      onError: (paymentVerificationKhaltiError) => {
        showNotification({
          title: "Payment Verification Error",
          message: "Redirecting to Payments",
          color: "red",
        });
        navigate("/dashboard/payments");
      },
    }
  );
  useEffect(() => {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      khaltiPaymentDetails[pair[0]] = pair[1];
    }
    refetchpaymentVerificationKhalti();
  }, []);

  return (
    <div className="w-full h-screen grid place-content-center">
      <AiOutlineLoading3Quarters className="text-3xl text-emerald-500 animate-spin" />
    </div>
  );
};

export default Paymentverify;
