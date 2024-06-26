import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import { Button, CircularProgress } from "@mui/material";
import Image from "next/image";
import AdGraphLogo from "public/Logo.jpeg";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { useRouter } from "next/router";
import { useCBWSDK } from "@/context/CBWSDKReactContextProvider";
import "@coinbase/onchainkit/styles.css";
import { setWalletInfo } from "@/store/slice/walletinfo";
import { useAccount, useDisconnect } from "wagmi";
const Header = () => {
  const { address, status } = useAccount();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [accountsChanged, setAccountsChanged]: any = React.useState(null);
  const [chainChanged, setChainChanged] = React.useState<
    Record<string, unknown> | string | number | null
  >(null);
  const [message, setMessage] = React.useState<
    Record<string, unknown> | string | number | null
  >(null);
  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      setShow(false);
    } else {
      setShow(true);
    }
    setLastScrollY(window.scrollY);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const { provider }: any = useCBWSDK();
  const [connected, setConnected] = React.useState(
    Boolean(provider?.connected)
  );

  useEffect(() => {
    const accounts = localStorage.getItem(
      "-walletlink:https://www.walletlink.org:Addresses"
    );
    console.log("connec", accounts);
    if (accounts) {
      setConnected(true);
      setAccountsChanged(accounts);
    }
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      console.log("connn", provider);
      console.log("connn2");

      await provider.enable();
      setConnected(true);

      const tt = localStorage.getItem(
        "-walletlink:https://www.walletlink.org:Addresses"
      );
      setWalletInfo(tt);
      console.log("connn2", tt);
      setAccountsChanged(tt);
    } catch (error) {
      console.error("Error connecting:", error);
      // Optionally, you can set some state to handle the error in the UI
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    await provider.disconnect();
    localStorage.clear();
    setConnected(false);
    setAccountsChanged(null);
    setLoading(false);
  };

  const router = useRouter();
  const handleRedirect = () => {
    router.push("/");
  };
  const handleRedirect2 = () => {
    router.push("/profile");
  };

  React.useEffect(() => {
    console.log("add", address);
  });

  return (
    <div className={show ? styles.container : styles.ncontainer}>
      <div className={styles.subContainer1}>
        <Image
          src={AdGraphLogo}
          alt={"AdGraph"}
          width={60}
          height={60}
          onClick={handleRedirect}
          className="cursor-pointer"
          style={{ filter: "invert(0)", borderRadius: "8px" }}
        />
        <div className={styles.header}>AdGraph</div>
      </div>
      <div className={styles.boxwrap}>
        {loading ? (
          <CircularProgress />
        ) : connected ? (
          <>
            {accountsChanged && (
              <div
                className="flex h-10 items-center space-x-4"
                onClick={handleDisconnect}
              >
                <Avatar
                  address="0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9"
                  showAttestation
                />
                <div className="flex flex-col text-sm">
                  <b>
                    <Name address={accountsChanged} />
                  </b>
                  <Name address={accountsChanged} showAddress />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleConnect}
            >
              Connect
            </button>
          </>
        )}

        {/* <button className={`like-button`} onClick={handleRedirect2}></button> */}

        <div data-aos="fade-up" data-aos-delay="400">
          <a
            className="btn text-white bg-purple-600 hover:bg-purple-700 w-full mb-4 sm:w-auto sm:mb-0"
            href="/profile"
          >
            Profile
          </a>
        </div>
        <div data-aos="fade-up" data-aos-delay="400">
          <a
            className="btn text-white bg-purple-600 hover:bg-purple-700 w-full mb-4 sm:w-auto sm:mb-0"
            href="/advertise"
          >
            Advertise
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
