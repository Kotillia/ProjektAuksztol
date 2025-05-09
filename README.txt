Odpalenie frontu:
1.open cmd
2.cd C:\...\ProjektAuksztol\frontend
3. npm install
4. npm run dev

Odpalenie backend
1. open cmd
2. cd C:\...\ProjektAuksztol\game-price-tracker
3. npm isnall
4. npm run dev

Odpalenie bazy danych
1. Open SQL server managment studio
2. Ustaw hasło konta "sa" - 123
3. Utwórz bazę dannych "GamePriceTracker"
4. Prawy przycisk myszy na bazę -> New Query
5. 

create table Gry(
id numeric(5) identity(1,1) Primary key,
NazwaGry varchar(30),
CenaEneba varchar(10),
CenaSteam varchar(10),
Obrazek varchar(1000),
OcenaGry varchar(30),
Opis varchar(8000),
DataAktualizacji DATETIME DEFAULT GETDATE())

5. open cmd
6. npm install mssql
7. cd C:\...\ProjektAuksztol\game-price-tracker
8. node server.js