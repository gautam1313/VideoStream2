import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/disney.png";

const NavBar = ({ account }) => {
  return (
    <div className="navbar">
      <div className="logo-container">
        <Link href="/">
          <Image src={logo} alt="Disney Logo" height={50} width={90} />
        </Link>
      </div>
      <div className="account-info">
        <p>Welcome {account.username}</p>
        <img className="avatar" src={account.avatar.url} />
      </div>
    </div>
  );
};

export default NavBar;
