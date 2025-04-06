"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  title: string;
  content: string;
}

export default function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    title: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TODO: 实现表单提交到后端的逻辑
      console.log(formData);

      // 提交成功后导航到完成页面
      router.push("/contact/complete");
    } catch (error) {
      console.error("提交失败:", error);
      // TODO: 显示错误消息
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
        <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
          お問い合わせ
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <label className="w-40 text-[16px] font-medium text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
              名前
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="苗字 名前"
              className="w-[460px] px-3 py-2 border border-[#BBBBBB] rounded text-[16px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic placeholder:opacity-50"
              required
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="w-40 text-[16px] font-medium text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sample@nana-hotel"
              className="w-[460px] px-3 py-2 border border-[#BBBBBB] rounded text-[16px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic placeholder:opacity-50"
              required
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="w-40 text-[16px] font-medium text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
              電話番号
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="000-0000-0000"
              className="w-[460px] px-3 py-2 border border-[#BBBBBB] rounded text-[16px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic placeholder:opacity-50"
              required
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="w-40 text-[16px] font-medium text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
              タイトル
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-[460px] px-3 py-2 border border-[#BBBBBB] rounded text-[16px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic"
              required
            />
          </div>

          <div className="flex items-start gap-6">
            <label className="w-40 text-[16px] font-medium text-[#444444] tracking-[0.06em] font-zen-kaku-gothic whitespace-nowrap">
              お問い合わせ内容
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="お問い合わせ内容を入力してください"
              rows={6}
              className="w-[460px] px-3 py-2 border border-[#BBBBBB] rounded text-[16px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic placeholder:opacity-50 resize-none"
              required
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-12 py-4 bg-[#444444] text-white rounded-full text-[16px] tracking-[0.06em] font-zen-kaku-gothic"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
