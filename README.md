# Bounder frontend
A trading algorithm

### 1. Install dependencies
Install all the dependencies 
```
npm install
```


### 2. Run the project
```
npm run dev
```


### 3. Visualize a stock
Go to `http://localhost:5173/supertrend/AAPL/d/2012-01-01/2023-01-01` to visualize the APPLE stock.
```
/supertrend/:symbol/:period/:from/:to'
```

#### 3.1. Symbol can be found on Yahoo finance : 
```
Example: 
APPLE -> AAPL
NVIDIA -> NVDA
```

#### 3.2. Period can be : 
```
'd' (daily)
'w' (weekly)
'm' (monthly)
'v' (dividends only)
```

