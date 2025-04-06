"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

const Navbar = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  // 处理登录 - 使用Auth0
  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  // 处理注册 - 重定向到Auth0注册页面
  const handleRegister = () => {
    window.location.href = "/api/auth/login?screen_hint=signup";
  };

  // 处理登出 - 使用Auth0
  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  const navItems = [
    { name: "施設予約", href: "/" },
    { name: "予約一覧", href: "/reservations", requireLogin: true },
    { name: "会員情報", href: "/member", requireLogin: true },
    { name: "利用ガイド", href: "/guide" },
    { name: "よくある質問", href: "/faq" },
    { name: "お問い合わせ", href: "/contact" },
  ];

  return (
    <nav className="bg-[#FAF9F7] w-full pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="naNA SAUNA AND HOTEL"
                width={120}
                height={40}
                priority
              />
            </Link>
          </div>
          <div className="hidden md:flex md:flex-1 md:justify-center">
            <div className="flex space-x-6">
              {navItems
                .filter((item) => !item.requireLogin || !!user)
                .map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-normal text-[#444444] hover:text-gray-900 font-zen-kaku-gothic"
                  >
                    {item.name}
                  </Link>
                ))}
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-2">
            {isLoading ? (
              <span className="text-gray-500 text-sm">読み込み中...</span>
            ) : user ? (
              <>
                <Link
                  href="/passcode"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#444444] rounded-full hover:bg-[#333333]"
                >
                  入室パスコード
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#444444] rounded-full hover:bg-[#333333]"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#444444] rounded-full hover:bg-[#333333]"
                >
                  ログイン
                </button>
                <button
                  onClick={handleRegister}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#444444] rounded-full hover:bg-[#333333]"
                >
                  会員登録
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
