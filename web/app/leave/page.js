"use client";

import DeleteConfirmDialog from "@/lib/components/deleteConfirmDialog";
import LeaveDrawer from "@/lib/components/leaveDrawer";
import LeaveTable from "@/lib/components/table/LeaveTable";
import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import {
  getAllLeaves,
  getLeaveBalance,
  withdrawLeave,
} from "@/lib/services/leave";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
} from "chart.js";
import { useCallback, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import toast from "react-hot-toast";

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [isLeaveDrawerVisible, setIsLeaveDrawerVisible] = useState(false);
  const [leaveId, setLeaveId] = useState(0);
  const [user, setUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });

  ChartJS.register(CategoryScale, LinearScale, BarElement);

  useEffect(() => {
    (async () => {
      let user = getUserFromLocalStorage();
      setUser(user);
      await getSetLeaves(user?.token);
      await getSetLeaveBalance(user?.token);
    })();
  }, []);

  const getSetLeaveBalance = async (token) => {
    let response = await getLeaveBalance(token);
    if (response.status === "success") {
      let leaveBalance = response.data;
      let labels = leaveBalance.map((leave) => {
        return leave.name;
      });
      let leavesTaken = leaveBalance.map((leave) => {
        return leave.leavesTaken;
      });

      setChartData({
        ...chartData,
        labels: labels,
        datasets: [
          {
            data: leavesTaken,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
          },
        ],
      });
    } else {
      toast.error("Unable to get leave balance");
    }
  };

  const getSetLeaves = async (token) => {
    let response = await getAllLeaves(token);
    if (response.status === "success") {
      setLeaves(response.data);
    } else {
      toast.error("Unable to get leaves");
    }
  };

  const handleAddLeave = useCallback(() => {
    setIsLeaveDrawerVisible(true);
  }, []);

  const handleEditLeave = useCallback(
    (index) => (event) => {
      let leave = leaves[index];
      setLeaveId(leave.leaveId);
      setIsLeaveDrawerVisible(true);
    },
    [leaves]
  );

  const handleDeletLeave = useCallback(
    (index) => async (event) => {
      if (isDeleteModalOpen) {
        let leave = leaves[index];

        let response = await withdrawLeave(leave?.leaveId || 0, user.token);
        if (response.status === "success") {
          toast.success("Leave request withdrawn.");
          await getSetLeaves(user?.token);
          await getSetLeaveBalance(user?.token);
        } else {
          toast.error(response.errors);
        }
        setIsDeleteModalOpen(false);
      } else {
        setIsDeleteModalOpen(true);
        setCurrentIndex(index);
      }
    },
    [isDeleteModalOpen]
  );

  const handleCloseDrawer = (getLeaves) => async (event) => {
    if (getLeaves) {
      await getSetLeaves(user.token);
      await getSetLeaveBalance(user?.token);
      setLeaveId(0);
    }

    setIsLeaveDrawerVisible(false);
  };

  return (
    <>
      <div
        style={{ width: "100%", height: "300px" }}
        className="flex justify-around my-10"
      >
        <Bar
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                suggestedMax: 7,
              },
            },
          }}
          data={chartData}
        />
      </div>
      <div>
        <LeaveTable
          leaves={leaves}
          onAdd={handleAddLeave}
          onEdit={handleEditLeave}
          onDelete={handleDeletLeave}
        />
      </div>

      <LeaveDrawer
        open={isLeaveDrawerVisible}
        onClose={handleCloseDrawer}
        leaveId={leaveId}
      />

      <DeleteConfirmDialog
        open={isDeleteModalOpen}
        onCancel={setIsDeleteModalOpen}
        onConfirm={handleDeletLeave}
        currentIndex={currentIndex}
      />
    </>
  );
}
