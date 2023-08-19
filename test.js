const data = [
  15_000, 20_000, 25_000, 150_000, 30_000, 15_000, 40_000, 20_000, 10_000,
]
let res = 0
for (let i = 0; i < data.length; i++) {
  const element = data[i]
  res = res + element
}
console.log(res)
