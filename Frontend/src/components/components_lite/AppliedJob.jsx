import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const AppliedJob = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div className="mt-5">
      <Table>
        <TableCaption className="text-gray-500">
          Recent Applied Jobs
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {(!allAppliedJobs || allAppliedJobs.length === 0) ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-10">
                🚫 You have not applied to any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                
                {/* DATE */}
                <TableCell>
                  {appliedJob?.createdAt
                    ? appliedJob.createdAt.split("T")[0]
                    : "N/A"}
                </TableCell>

                {/* TITLE */}
                <TableCell>
                  {appliedJob?.job?.title || "N/A"}
                </TableCell>

                {/* COMPANY */}
                <TableCell>
                  {appliedJob?.job?.company?.name || "N/A"}
                </TableCell>

                {/* STATUS */}
                <TableCell className="text-right">
                  <Badge
                    className={`text-white px-3 py-1 ${
                      appliedJob?.status === "rejected"
                        ? "bg-red-500"
                        : appliedJob?.status === "accepted"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {appliedJob?.status || "pending"}
                  </Badge>
                </TableCell>

              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJob;