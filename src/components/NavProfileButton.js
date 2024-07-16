"use client";
import React, { useRef } from "react";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import styles from "@/styles/layout.module.css";

export default function ProfileButton() {

  const menuLeft = useRef(null);
  const route = useRouter();
  const { data: session } = useSession();
  let user = session?.user;
  let items = [
    {
      template: (item, options) => {
        return (
          <Link href="/dashboard/profile">
            <div className={"p-2 w-full p-link flex flex align-items-center"}>
              <Avatar
                icon="pi pi-user "
                size="small"
                shape="circle"
                onClick={(event) => menuLeft.current.toggle(event)}
              />
              <div className="name-div ml-2">
                <span className="font-bold">{user?.lastName}</span>
                <p className="text-sm">{user?.role}</p>
              </div>
            </div>
          </Link>
        );
      },
    },
    { separator: true },
    {
      command: () => {
        signOut({
          redirect: false,
        });
        route.push("/auth/signin");
      },
      label: "Αποσύνδεση",
      icon: "pi pi-fw pi-power-off",
    },
  ];

  return (
    <div className="card flex justify-content-center">
      <button
        onClick={(event) => menuLeft.current.toggle(event)}
        className={styles.button}
      >
        <i className="pi pi-user"></i>
      </button>
      <Menu
        model={items}
        popup
        style={{ marginTop: "2rem" }}
        ref={menuLeft}
        autoZIndex
      />
    </div>
  );
}
