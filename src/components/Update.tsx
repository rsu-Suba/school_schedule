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
         title="Update (Apr 1)"
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
         <h3>テスト期間の特別時間割に対応✅️</h3>
         <h3>レスポンシブデザイン対応, レイアウトの調整✅️</h3>
      </Modal>
   );
}
