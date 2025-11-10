// src/components/Spinner.tsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Spinner() {
  return (
    <div className="text-center">
      <span className="text-2xl">
        <FontAwesomeIcon icon={faSpinner} spin className="text-5xl" />
        <br />
        로딩 중...
      </span>
    </div>
  );
}
