import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

// Ini untuk memanggil Prisma
import prisma from "../lib/prisma";

Index.propTypes = {
	list_user: PropTypes.array,
};

export default function Index(props) {
	return (
		<Container maxWidth="lg">
			<Box
				sx={{
					my: 4,
					p: 2,
					borderRadius: "10px",
					backgroundColor: "background.paper",
				}}
			>
				<Typography variant="h6" component="h1" gutterBottom>
					Belajar Prisma
				</Typography>
				<ul>
					{props.list_user.map((baris) => (
						<li key={baris.id}>
							ID User {baris.id} - User ID : {baris.user_id} -
							Nama : {baris.nama}
						</li>
					))}
				</ul>
			</Box>
		</Container>
	);
}

// Kita akan gunakan getServerSideProps untuk ambil isi tabel
export async function getServerSideProps() {
	// Load semua isi tbl_user
	const isi_tbl_user = await prisma.tbl_user.findMany({});

	return {
		props: {
			list_user: isi_tbl_user,
		},
	};
}
