# Belajar Prisma

Tujuan :

-   Dapat Mengkonfigurasi Prisma
-   Dapat melakukan CRUD menggunakan Prisma dan MUI

Skenario :
Aplikasi akan mengakses DB MsSQL di lokal

## Setting Database MS SQL

```
Database  : BELAJAR
User      : user_belajar
Password  : Belajar234#
```

### Buat tabel

Buat tabel `tbl_user` dengan perintah di bawah ini:

```sql
CREATE TABLE tbl_user(
id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
user_id varchar(10) NOT NULL,
nama varchar(50) NOT NULL
);
```

### Isi Tabel

Isi tabel `tbl_user` dengan perintah di bawah ini:

```sql
INSERT INTO tbl_user (user_id, nama) VALUES ('chandra','Chandra Mulyana');
INSERT INTO tbl_user (user_id, nama) VALUES ('mulyana','Mulyana Chandra');
```

## Install Prisma

```javascript
npm install prisma
```

## Inisialisasi Prisma

Jalankan perintah berikut :

```javascript
npx prisma init
```

sehingga muncul sebagai berikut :

```javascript
✔ Your Prisma schema was created at prisma/schema.prisma
You can now open it in your favorite editor.

warn You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:

1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started

```

Perintah di atas akan membuat sebuah file `schema.prisma` di dalam folder `prisma`.
File ini berisi struktur database.

Selain itu juga akan membuat file `.env` yang berisi connection string untuk ke database

## Setting Connection String untuk MsSQL

Berikut Settingan MsSQL untuk skenario kali ini

```
Database  : BELAJAR
User      : user_belajar
Password  : Belajar234#
```

Buka `.env` file dan replace dengan settingan untuk MsSQL.
Jika mengikuti skenario di atas , maka Connection String-nya adalah sbb

```javascript
DATABASE_URL =
	"sqlserver://localhost:1433;database=BELAJAR;user=user_belajar;password=Belajar234#;TrustServerCertificate=true;";
```

Kemudian setting juga `provider db` di file `schema.prisma` sehingga isinya sebagai berikut :

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}
```

## PULL DATABASE

Skenario dalam Prisma ada 2:

1. PULL Database : Menarik skema dari Database ke Prisma. Perintah nya : `npx prisma db pull`
2. PUSH Database : Mengirimkan/Update skema dari Prisma ke Database. Perintah nya : `npx prisma db push`

Kali ini kita menggunakan `skenario 1 -> PULL DB`.
Design database dilakukan diluar Prisma, misalnya dalam kasus kali ini untuk Design Database dilakukan di Ms SQL Management Studio.
Kemudian kita akan tarik skema Database nya ke dalam Prisma dengan perintah sebagai berikut :

```javascript
npx prisma db pull
```

maka akan muncul seperti ini :

```javascript
Prisma schema loaded from prisma\schema.prisma
Environment variables loaded from .env
Datasource "db": SQL Server database

✔ Introspected 1 model and wrote it into prisma\schema.prisma in 582ms

Run prisma generate to generate Prisma Client.
```

Silahkan check isi file `prisma\schema.prisma` isinya menjadi seperti di bawah ini :

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}

model tbl_user {
  id      Int    @id(map: "PK__tbl_user__3213E83F04D56044") @default(autoincrement())
  user_id String @db.VarChar(10)
  nama    String @db.VarChar(50)
}
```

Agar Prisma Client dalam aplikasi Next.js ini dapat mengakses tabel-tabel tersebut, maka sesuai perintah Prisma sebelumnya
`Run prisma generate to generate Prisma Client.`

Lakukan perintah berikut :

```javascript
npx prisma generate
```

Nanti akan muncul seperti di bawah ini :

```javascript
...

✔ Installed the @prisma/client and prisma packages in your project

✔ Generated Prisma Client (4.11.0 | library) to .\node_modules\@prisma\client in 142ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client

---
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
---
```

## Membuat library untuk akses Prisma

Buat directory `lib` pada root directory. Kemudian buat sebuah file dengan nama `prisma.js` yang isinya adalah sebagai berikut

```javascript
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

export default prisma;
```

## Menampilkan isi tabel

Kita modifikasi file `index.js` yang sebelumnya seperti ini :

```javascript
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Index() {
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
			</Box>
		</Container>
	);
}
```

menjadi seperti ini :

```javascript
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
```

sehingga nanti output nya adalah sebegai berikut :

```
Belajar Prisma
ID User 1 - User ID : chandra - Nama : Chandra Mulyana
ID User 2 - User ID : mulyana - Nama : Mulyana Chandra
```

## Link untuk Prisma

Untuk Explore cara penggunaan, biasanya saya buka halaman berikut:

https://www.prisma.io/docs/concepts/components/prisma-client
