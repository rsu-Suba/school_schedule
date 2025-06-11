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
         title="Update (June 11)"
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
         <h3>バグ修正</h3>
         <h4>・時間割変更がUp Nextカードに適用されると画面に何も描画されない(白くなる)バグを修正✅️</h4>
      </Modal>
   );
}
