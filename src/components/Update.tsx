import { useEffect, useState } from "react";
import useContexts from "@/scripts/Data/Contexts";
import { Button, Modal } from "antd";

export default function UpdateNotice() {
   const { InfoContexts } = useContexts();

   const APP_VERSION = InfoContexts.UpdateVersion;
   const [showNotice, setShowNotice] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(true);

   useEffect(() => {
      const viewedVersion = localStorage.getItem("appVersion");
      if (viewedVersion !== APP_VERSION) {
         setShowNotice(true);
         localStorage.setItem("appVersion", APP_VERSION);
      }
   }, []);

   const handleOk = () => {
      setIsModalOpen(false);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };

   if (!showNotice) return null;

   return (
      <Modal
         title="Update (Mar 22)"
         open={isModalOpen}
         onOk={handleOk}
         onCancel={handleCancel}
         footer={[
            <Button type="primary" onClick={handleOk}>
               OK
            </Button>,
         ]}
         style={{ textAlign: "left" }}
      >
         <h3>Timetableタブに落単チェッカーを追加✅️</h3>
         <p>教科を選択→テストの点数と課題提出率を入力すると予想成績点数が算出</p>
         <h3>Otherタブに設定パネルを追加✅️</h3>
         <p>カスタムカラーと言語設定(日本語, 英語)が可能</p>
      </Modal>
   );
}
