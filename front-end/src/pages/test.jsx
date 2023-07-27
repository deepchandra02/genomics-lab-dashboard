// import React, { useState} from "react";
// import { Card, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody, BadgeDelta, MultiSelect, MultiSelectItem }
//   from "@tremor/react";

// /
// const data = require('../newdata/data0.json');
// const Progress = (props) => {
//   const [selectedSamples, setSelectedSamples] = useState([]);

//   const isSampleSelected = (item) =>
//     selectedSamples.includes(item.sample_id) || selectedSamples.length === 0;

//   return (
//     <Card>

//       {data && (<Table className="mt-6">
//         <TableHead>
//           <TableRow>
//             <TableHeaderCell>
//               <MultiSelect
//                 onValueChange={setSelectedSamples}
//                 placeholder="Select Samples..."
//                 className="max-w-xs"
//               >
//                 {data.map((item) => (
//                   <MultiSelectItem key={item.name} value={item.name}>
//                     {item.name}
//                   </MultiSelectItem>
//                 ))}
//               </MultiSelect>
//             </TableHeaderCell>
//           </TableRow>
//           <TableRow>
//             <TableHeaderCell>Sample ID</TableHeaderCell>
//             <TableHeaderCell className="text-right">Flowcell ID</TableHeaderCell>
//             <TableHeaderCell className="text-right">Submission ID ($)</TableHeaderCell>
//             <TableHeaderCell className="text-right">Demultiplexed</TableHeaderCell>
//             <TableHeaderCell className="text-right">Staged</TableHeaderCell>
//             <TableHeaderCell className="text-right">Lane fastq</TableHeaderCell>
//             <TableHeaderCell className="text-right">Merged fastq</TableHeaderCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {data
//             .filter((item) => isSampleSelected(item))
//             .map((item) => (
//               <TableRow key={item.sample_id}>
//                 <TableCell>{item.sample_id}</TableCell>
//                 <TableCell className="text-right">{item.fc_id}</TableCell>
//                 <TableCell className="text-right">{item.submission_id}</TableCell>
//                 <TableCell className="text-right">{item.loading_date}</TableCell>
//                 <TableCell className="text-right">{item.loading_date}</TableCell>
//                 <TableCell className="text-right">{item.loading_date}</TableCell>
//                 <TableCell className="text-right">
//                   <BadgeDelta deltaType="unchanged" size="xs">
//                     {item.loading_date}
//                   </BadgeDelta>
//                 </TableCell>
//               </TableRow>
//             ))}
//         </TableBody>
//       </Table>)}
//     </Card>
//   );
// }

// export default Progress