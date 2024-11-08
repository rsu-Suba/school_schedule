import json from "./assets/main.json";
import { List, Select, Input, DatePicker } from "antd";

export default timeChange = (props) => {
   return (
      <div>
         <div className="carddiv">
            <p className="cardtex">{props.card}</p>
            <div className="cardChanged" id="card">
               <div className="card cardCh">
                  <div className="changedSub">
                     <DatePicker
                        views={["year", "month", "day"]}
                        label="Date"
                        value={props.date}
                        minDate={dayjs()}
                        maxDate={dayjs("2025-03-31")}
                        defaultValue={dayjs()}
                        onChange={(selectedDate) => {
                           setDate(selectedDate || Today);
                        }}
                     />
                     <Select
                        labelId="Label-Time"
                        value={time}
                        label="Time"
                        onChange={handleChangeTime}
                        options={times}
                     />
                  </div>
                  <Select
                     labelId="Label-Sub"
                     value={sub}
                     label="Subject"
                     onChange={handleChangeSub}
                     options={subsListOpt}
                  />
                  <div className="changedButton">
                     <div style={{ cursor: "pointer" }} onClick={() => get(0)} disabled={isFetching}>
                        更新
                     </div>
                     <div style={{ cursor: "pointer" }} onClick={() => post(0)}>
                        変更
                     </div>
                  </div>
                  {isFetching && <p>データ更新中</p>}
                  {isPosting && <p>データ送信中</p>}
               </div>
               <div>
                  {error ? (
                     <p style={{ color: "red" }}>{error}</p>
                  ) : data[0] ? (
                     <div>
                        {data.map((date, index) => (
                           <List className="card scheCard">
                              <List.Item>
                                 <div key={index} className="changeCard">
                                    <p className="scheText">
                                       {new Date(date[0]).getMonth() + 1}/{new Date(date[0]).getDate()}
                                    </p>
                                    {date[1].map((val, ind) => (
                                       <div className="subProp">
                                          <p className="scheText">{subsList[val[1] - 1]}</p>
                                          <p className="scheText">{json.time[1][val[0]]}</p>
                                       </div>
                                    ))}
                                 </div>
                              </List.Item>
                           </List>
                        ))}
                     </div>
                  ) : (
                     <List className="card scheCard">
                        <List.Item>
                           <p>データなし</p>
                        </List.Item>
                     </List>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
