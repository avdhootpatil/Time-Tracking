"use client";

import { WithAuthentication } from "@/lib/components/auth";
import DeleteConfirmDialog from "@/lib/components/deleteConfirmDialog";
import { HolidayModal } from "@/lib/components/modal";
import HolidaysTable from "@/lib/components/table/HolidaysTable";
import YearSelect from "@/lib/components/yearSelect";
import { getUserFromLocalStorage, getYears } from "@/lib/helperFunctions";
import { deleteHoliday, getHolidays } from "@/lib/services/holidays";
import { Button } from "@mui/joy";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function HolidaysPage() {
  const [holidays, setHolidays] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [holidayId, setHolidayId] = useState(0);
  const [selectedYear, setSelectedYear] = useState(null);

  const user = getUserFromLocalStorage();
  const years = getYears();

  useEffect(() => {
    (async () => {
      let currentYear = years[years.length - 1];

      setSelectedYear(currentYear);

      if (currentYear !== null) {
        await getCurrentYearHolidays(currentYear.year, user.token);
      }
    })();
  }, []);

  const getCurrentYearHolidays = async (year, token) => {
    let response = await getHolidays(year, token);

    if (response.status === "success") {
      setHolidays(response.data);
    } else {
      toast.error("Unable to get holidays");
    }
  };

  const handleSearch = async () => {
    await getCurrentYearHolidays(selectedYear.year, user.token);
  };

  const handleAdd = () => {
    setHolidayId(0);
    setIsModalOpen(true);
  };

  const handleEdit = (index) => (event) => {
    let holiday = holidays[index];
    setHolidayId(holiday?.holidayId);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => async (event) => {
    if (isDeleteModalOpen) {
      let holiday = holidays[index];
      let response = await deleteHoliday(holiday?.holidayId || 0, user.token);
      if (response.status === "success") {
        toast.success("Holiday deleted successfully.");
        await getCurrentYearHolidays(selectedYear.year, user.token);
      } else {
        toast.error("Unable to delete Holiday");
      }
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(true);
      setCurrentIndex(index);
    }
  };

  const handleCloseModal = async (isSaved) => {
    if (isSaved) {
      await getCurrentYearHolidays(selectedYear.year, user.token);
    }

    setIsModalOpen(false);
    setHolidayId(0);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <div>
      <div className="mb-2 flex justify-start gap-2 items-end">
        <YearSelect
          options={years}
          value={selectedYear}
          onChange={handleYearChange}
        />
        <Button variant="soft" onClick={handleSearch} size="sm">
          Go
        </Button>
      </div>

      <HolidaysTable
        holidays={holidays || []}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={false}
      />

      <HolidayModal
        holidayId={holidayId}
        closeModal={handleCloseModal}
        selectedYear={selectedYear}
        isModalOpen={isModalOpen}
      />

      <DeleteConfirmDialog
        open={isDeleteModalOpen}
        onCancel={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        currentIndex={currentIndex}
      />
    </div>
  );
}

export default WithAuthentication(HolidaysPage);
