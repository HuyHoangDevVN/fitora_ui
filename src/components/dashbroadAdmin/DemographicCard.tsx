import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import CountryMap from "./CountryMap";
import { MoreDotIcon } from "@/icons";

// Fake dữ liệu nhân khẩu học cho dashboard khoa ~1000 sinh viên
const demographics = [
  {
    title: "Giới tính",
    data: [
      { label: "Nam", value: 520 },
      { label: "Nữ", value: 460 },
    ],
    icon: "♂️♀️",
  },
  {
    title: "Năm học",
    data: [
      { label: "Năm 1", value: 260 },
      { label: "Năm 2", value: 250 },
      { label: "Năm 3", value: 240 },
      { label: "Năm 4", value: 230 },
    ],
    icon: "🎓",
  },
  {
    title: "Chuyên ngành",
    data: [
      { label: "CNTT", value: 400 },
      { label: "Khoa học dữ liệu", value: 220 },
      { label: "Mạng máy tính", value: 180 },
      { label: "Hệ thống thông tin", value: 120 },
      { label: "Khác", value: 80 },
    ],
    icon: "💻📊",
  },
  {
    title: "Tỉ lệ sinh viên hoạt động",
    data: [
      { label: "Hoạt động thường xuyên", value: 720 },
      { label: "Hoạt động không thường xuyên", value: 180 },
      { label: "Ít hoạt động", value: 100 },
    ],
    icon: "🔥",
  },
];

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 custom-dark:border-gray-800 custom-dark:bg-white/[0.03] sm:p-6">
      {/* <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 custom-dark:text-white/90">
            Customers Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm custom-dark:text-gray-400">
            Number of customer based on country
          </p>
        </div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 custom-dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 custom-dark:text-gray-400 custom-dark:hover:bg-white/5 custom-dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 custom-dark:text-gray-400 custom-dark:hover:bg-white/5 custom-dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl custom-dark:border-gray-800 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap />
        </div>
      </div> */}

      {/* Ví dụ render dữ liệu nhân khẩu học */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demographics?.map((item) => (
          <div
            key={item.title}
            className="bg-white custom-dark:bg-gray-900 rounded-xl shadow p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-lg">{item.title}</span>
            </div>
            <ul>
              {item.data?.map((d) => (
                <li
                  key={d.label}
                  className="flex justify-between py-1 text-gray-700 custom-dark:text-gray-200"
                >
                  <span>{d.label}</span>
                  <span className="font-semibold">
                    {d.value.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
