import React from "react";

interface SelectLocationProps {
  setIsEditing: (isEditing: boolean) => void;
  setSearch: (search: string) => void;
  setSelectedCountry: (location: string) => void;
  isEditing: boolean;
  search: string;
  filteredCountries: string[];
  location: string;
  className?: string;
}

export default function SelectLocation({
  setIsEditing,
  setSearch,
  setSelectedCountry,
  isEditing,
  search,
  filteredCountries,
  location,
  className,
}: SelectLocationProps) {
  return (
    <>
      {/* 나라 선택 드롭다운 */}
      <div className="where-option2" onClick={() => setIsEditing(!isEditing)}>
        <div className="country-selector">
          {isEditing ? (
            <input
              type="text"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="나라를 검색하세요"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredCountries.length > 0) {
                  setSelectedCountry(filteredCountries[0]);
                  setSearch(""); // 입력창 비우기
                  setIsEditing(false); // 드롭다운 닫기
                }
              }}
            />
          ) : (
            <span
              style={{
                fontWeight: location ? "bold" : "normal",
                color: location ? "black" : "#b0b0b0",
              }}
            >
              {location || "나라 선택"}
            </span>
          )}
        </div>

        {/* 화살표 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="dropdown-arrow"
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
          />
        </svg>
      </div>

      {/* 드롭다운 메뉴 */}
      {isEditing && (
        <div className="dropdown-menu">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <div
                key={index}
                className="dropdown-option"
                onClick={() => {
                  setSelectedCountry(country);
                  setSearch("");
                  setIsEditing(false);
                }}
              >
                {country}
              </div>
            ))
          ) : (
            <div className="no-results">검색 결과가 없습니다.</div>
          )}
        </div>
      )}
    </>
  );
}
