// import {
//   Box,
//   Grid,
//   Typography,
//   IconButton,
//   Stack,
//   Divider,
// } from "@mui/material";
// import {
//   Home,
//   Phone,
//   MapPin,
//   Facebook,
//   Twitter,
//   Instagram,
//   Linkedin,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function Footer() {
//   return (
//     <Box sx={{ bgcolor: "primary.dark", color: "white", py: 5, px: 3 }}>
//       <Grid container spacing={5}>
//         <Box>
//           <Stack direction="row" alignItems="center" spacing={2} mb={2}>
//             <Box
//               sx={{
//                 width: 40,
//                 height: 40,
//                 bgcolor: "primary.main",
//                 borderRadius: 2,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Home size={20} color="white" />
//             </Box>
//             <Box>
//               <Typography variant="h4" fontWeight="bold">
//                 TaskY
//               </Typography>
//               <Typography variant="caption" color="grey.300">
//                 We help you be proud
//               </Typography>
//             </Box>
//           </Stack>
//           <Typography variant="body2" color="grey.400" mb={2}>
//             Great things happen one step at a time. Stay focused—your hard work
//             is building your future.
//           </Typography>
//           <Stack direction="row" spacing={2}>
//             {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
//               <IconButton
//                 key={index}
//                 sx={{
//                   color: "grey.300",
//                   "&:hover": { color: "primary.light" },
//                 }}
//               >
//                 <Icon size={20} />
//               </IconButton>
//             ))}
//           </Stack>
//         </Box>

//         <Box m={5}>
//           <Typography variant="h6" gutterBottom>
//             Quick Links
//           </Typography>
//           <Stack spacing={1}>
//             <Link to="/" style={{ color: "#bbb", textDecoration: "none" }}>
//               Tasks
//             </Link>
//             <Link
//               to="/NewTask"
//               style={{ color: "#bbb", textDecoration: "none" }}
//             >
//               New Task
//             </Link>
//             <Link
//               to="/CompletedTask"
//               style={{ color: "#bbb", textDecoration: "none" }}
//             >
//               Completed Tasks
//             </Link>
//             <Link
//               to="/Profile"
//               style={{ color: "#bbb", textDecoration: "none" }}
//             >
//               Profile
//             </Link>
//             <Link to="/Trash" style={{ color: "#bbb", textDecoration: "none" }}>
//               Trash
//             </Link>
//           </Stack>
//         </Box>

//         <Box m={5}>
//           <Typography variant="h6" gutterBottom>
//             Services
//           </Typography>
//           <Stack spacing={1}>
//             <Typography variant="body2" color="grey.400">
//               Smart Task Listings
//             </Typography>
//             <Typography variant="body2" color="grey.400">
//               Data-Backed Insights
//             </Typography>
//             <Typography variant="body2" color="grey.400">
//               Verified Task Entries
//             </Typography>
//             <Typography variant="body2" color="grey.400">
//               Self Organization
//             </Typography>
//             <Typography variant="body2" color="grey.400">
//               Task Flow Management
//             </Typography>
//           </Stack>
//         </Box>

//         <Box m={5}>
//           <Typography variant="h6" gutterBottom>
//             Contact Us
//           </Typography>
//           <Stack spacing={1}>
//             <Stack direction="row" alignItems="center" spacing={1}>
//               <MapPin size={18} color="#90caf9" />
//               <Typography variant="body2" color="grey.400">
//                 Nairobi, Kenya
//               </Typography>
//             </Stack>
//             <Stack direction="row" alignItems="center" spacing={1}>
//               <Phone size={18} color="#90caf9" />
//               <Typography variant="body2" color="grey.400">
//                 +254 799715875
//               </Typography>
//             </Stack>
//           </Stack>
//         </Box>
//       </Grid>

//       {/* Bottom line */}
//       <Divider sx={{ bgcolor: "grey.700", my: 4 }} />
//       <Typography variant="body2" textAlign="center" color="grey.500">
//         © 2025 TaskY. All rights reserved. | Smart Planning for you
//       </Typography>
//     </Box>
//   );
// }
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import {
  Home,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "primary.dark", color: "white", py: 5, px: 3 }}>
      <Grid container spacing={5}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Home size={20} color="white" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                TaskY
              </Typography>
              <Typography variant="caption" color="grey.300">
                We help you be proud
              </Typography>
            </Box>
          </Stack>
          <Typography variant="body2" color="grey.400" mb={2}>
            Great things happen one step at a time. Stay focused—your hard work
            is building your future.
          </Typography>
          <Stack direction="row" spacing={2}>
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <IconButton
                key={index}
                sx={{
                  color: "grey.300",
                  "&:hover": { color: "primary.light" },
                }}
              >
                <Icon size={20} />
              </IconButton>
            ))}
          </Stack>
        </Box>

        <Box m={5}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Stack spacing={1}>
            <Link to="/" style={{ color: "#bbb", textDecoration: "none" }}>
              Tasks
            </Link>
            <Link
              to="/NewTask"
              style={{ color: "#bbb", textDecoration: "none" }}
            >
              New Task
            </Link>
            <Link
              to="/CompletedTask"
              style={{ color: "#bbb", textDecoration: "none" }}
            >
              Completed Tasks
            </Link>
            <Link
              to="/Profile"
              style={{ color: "#bbb", textDecoration: "none" }}
            >
              Profile
            </Link>
            <Link to="/Trash" style={{ color: "#bbb", textDecoration: "none" }}>
              Trash
            </Link>
          </Stack>
        </Box>

        <Box m={5}>
          <Typography variant="h6" gutterBottom>
            Services
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="grey.400">
              Smart Task Listings
            </Typography>
            <Typography variant="body2" color="grey.400">
              Data-Backed Insights
            </Typography>
            <Typography variant="body2" color="grey.400">
              Verified Task Entries
            </Typography>
            <Typography variant="body2" color="grey.400">
              Self Organization
            </Typography>
            <Typography variant="body2" color="grey.400">
              Task Flow Management
            </Typography>
          </Stack>
        </Box>

        <Box m={5}>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <MapPin size={18} color="#90caf9" />
              <Typography variant="body2" color="grey.400">
                Nairobi, Kenya
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Phone size={18} color="#90caf9" />
              <Typography variant="body2" color="grey.400">
                +254 799715875
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Grid>

      {/* Bottom line */}
      <Divider sx={{ bgcolor: "grey.700", my: 4 }} />
      <Typography variant="body2" textAlign="center" color="grey.500">
        © 2025 TaskY. All rights reserved. | Smart Planning for you
      </Typography>
    </Box>
  );
}
