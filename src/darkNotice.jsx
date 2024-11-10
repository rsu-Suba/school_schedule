import React, { useState } from "react";
import { Button, Modal, ConfigProvider, theme } from "antd";
import DarkTheme from "./darkComp.jsx";
const App = (props) => {
   const [isModalOpen, setIsModalOpen] = useState(true);
   const { darkAlgorithm } = theme;
   const handleOk = () => {
      document.cookie = `isDarkFirst=false`;
      setIsModalOpen(false);
   };
   const darkcall = (data) => {
      props.handleValueChange(data);
   };
   const handleCancel = () => {
      setIsModalOpen(false);
   };
   return (
      <>
         <ConfigProvider
            theme={{
               algorithm: darkAlgorithm,
               token: {
                  borderRadius: 32,
               },
            }}
         >
            <Modal
               title="Dark Update"
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
               <p style={{ color: "#fff" }}>ダークテーマに対応😎(Otherタブで変更可能)</p>
               <div className="subProp">
                  <p style={{ color: "#fff" }}>Live in the dark</p>
                  <DarkTheme handleValueChange={darkcall} dark={props.dark} />
               </div>
            </Modal>
         </ConfigProvider>
      </>
   );
};
export default App;
