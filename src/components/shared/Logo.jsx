import { Link } from 'react-router'
import { PiStudentFill } from "react-icons/pi";

const Logo = () => {
    return (
        <Link to="/" className="flex items-center gap-2">
          {/* <Logo/> */}
          <PiStudentFill className="w-8 h-8 text-primary" />
          <span className="text-2xl -ml-1 font-bold text-primary">
            Edu Sync
          </span>
        </Link>
    );
};

export default Logo;