import "@/App.css";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import InterpreterModeOutlinedIcon from "@mui/icons-material/InterpreterModeOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import LaptopOutlinedIcon from "@mui/icons-material/LaptopOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";

function IconProvider(props: { icon: string }) {
   if (props.icon == "CalculateOutlinedIcon") {
      return <CalculateOutlinedIcon />;
   }
   if (props.icon == "FitnessCenterOutlinedIcon") {
      return <FitnessCenterOutlinedIcon />;
   }
   if (props.icon == "DnsOutlinedIcon") {
      return <DnsOutlinedIcon />;
   }
   if (props.icon == "InterpreterModeOutlinedIcon") {
      return <InterpreterModeOutlinedIcon />;
   }
   if (props.icon == "LaptopOutlinedIcon") {
      return <LaptopOutlinedIcon />;
   }
   if (props.icon == "TranslateOutlinedIcon") {
      return <TranslateOutlinedIcon />;
   }
   if (props.icon == "TerminalOutlinedIcon") {
      return <TerminalOutlinedIcon />;
   }
   if (props.icon == "BoltOutlinedIcon") {
      return <BoltOutlinedIcon />;
   }
   if (props.icon == "ScienceOutlinedIcon") {
      return <ScienceOutlinedIcon />;
   }
   if (props.icon == "MenuBookOutlinedIcon") {
      return <MenuBookOutlinedIcon />;
   }
   if (props.icon == "HotelOutlinedIcon") {
      return <HotelOutlinedIcon />;
   }
}

export default IconProvider;
