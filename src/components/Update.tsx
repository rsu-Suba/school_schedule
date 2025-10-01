import { useEffect, useState } from "react";
import useContexts from "@/scripts/Data/Contexts";
import { Button, Modal } from "antd";

export default function UpdateNotice() {
	const { InfoContexts, UpdateContexts } = useContexts();

	const APP_VERSION = InfoContexts.UpdateVersion;
	const [showNotice, setShowNotice] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(true);

	useEffect(() => {
		const viewedVersion = localStorage.getItem("appVersion");
		if (viewedVersion !== APP_VERSION) {
			setShowNotice(true);
			setIsModalOpen(true);
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
			title={`Update (${UpdateContexts.date})`}
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
			<>
				<h3>{UpdateContexts.title}</h3>
				{UpdateContexts.texts.map((text, index) => (
					<h4 key={index}>{text}</h4>
				))}
			</>
		</Modal>
	);
}
