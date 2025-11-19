import React from 'react'

const EnryExit = () => {
  return (
    <div>


<Grid item xs={12} sm={6} md={4} lg={3}>
        <Box
          sx={{
            backgroundColor: "#9EA0D8",
            fontWeight: "bold",
            height: "130px",
            width: "100%",
            borderRadius: "15px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
            }
          }}
        >
          <Link to='/allstaffs' style={{ color: 'white', textDecoration: "none" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Total Staffs</Typography>
          </Link>
          <IoPeopleSharp style={{ height: "70px", width: "70px", color: "white" }} />
          <Typography variant="h4" sx={{ mt: 1, color: "white" }}>{staffsCount}</Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Box
          sx={{
            backgroundColor: "#FA8892",
            fontWeight: "bold",
            height: "130px",
            width: "100%",
            borderRadius: "15px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
            }
          }}
        >
          <Link to='/sibStu' style={{ color: 'white', textDecoration: "none" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Total Revenue</Typography>
          </Link>
          <RiMoneyRupeeCircleFill style={{ height: "70px", width: "70px", color: "white" }} />
          <Typography variant="h4" sx={{ mt: 1, color: "white" }}>
            {totalRevenue ? `${totalRevenue.total_paid_amount}` : "Loading..."}
          </Typography>
        </Box>
      </Grid>
    </div>
  )
}

export default EnryExit