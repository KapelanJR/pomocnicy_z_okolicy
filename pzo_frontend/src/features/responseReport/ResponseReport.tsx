import { Data } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import Map from "../map/Map";
import { acceptReport } from "../reports/actions";
import { Report } from "../reports/reportsSlice";

export interface PropType {
  report: Report;
}

function ResponseReport({ report }: PropType) {
  const curr_lat = useAppSelector(
    (state) => state.reducer.reportsSlice.current_latitude
  );
  const curr_lon = useAppSelector(
    (state) => state.reducer.reportsSlice.current_altitude
  );
  const curr_distance = React.useMemo(
    () =>
      (Math.pow(
        Math.pow(curr_lat - report.latitude, 2) +
          Math.pow(curr_lon - report.altitude, 2),
        0.5
      ) /
        360) *
      6356752,
    [curr_lat, curr_lon]
  );
  const d = new Date();
  let reportTimeSec = d.getSeconds();
  const [curr_time, settime] = useState(d.getSeconds());
  const dispach = useAppDispatch();
  useEffect(() => {
    setInterval(() => settime(Date.now()), 5000);
  }, []);
  const [rs, setRs] = useState("NONE");
  const a_r = useAppSelector((state) => state.reducer.reportsSlice.avaliable_report_types);
  function reportDenied() {
    setRs("DENIED");
  }

  function reportAccepted() {
    setRs("ACCEPTED");
    if (report.id !== undefined) dispach(acceptReport(report.id));
  }

  return (
    <div className="response-report">
      <div className="report-type">{report.report_type}</div>
      <div className="map">
        <Map lat={report.latitude} lng={report.altitude} />
      </div>
      <div className="report-info">
        <div className="report-info-description">{report.description}</div>
        <div className="report-info-bottom">
          <div className="report-info-bottom-left">
            <div className="report-info-distance">{curr_distance.toFixed(1)} m</div>
            <div className="report-info-time">

            </div>
          </div>
          <div className="report-info-bottom-right report-info-user">
            <div></div>
          </div>
        </div>
      </div>
      <div className="response-react">
        {rs === "NONE" ? (
          <div>
            {" "}
            <button onClick={reportAccepted}>Akceptuj</button>{" "}
            <button onClick={reportDenied}>Odrzuć</button>{" "}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default React.memo(ResponseReport);
