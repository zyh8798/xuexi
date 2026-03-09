/**
 * Node SSE API
 * 模拟 LLM token 流式输出
 */

import http from "http"

// 允许跨域（前后端分离必须）
function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
}

// 模拟 AI token 生成
async function* fakeLLM(prompt) {

  const text = `你刚刚说的是: ${prompt} ，这是服务器流式返回的内容。`

  for (const char of text) {

    // 模拟模型推理延迟
    await new Promise(r => setTimeout(r, 150))

    yield char
  }

}

const server = http.createServer(async (req, res) => {

  if (req.method === "OPTIONS") {
    setCors(res)
    res.writeHead(204)
    res.end()
    return
  }

  // AI chat API
  if (req.url === "/chat" && req.method === "POST") {

    setCors(res)

    // SSE header
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    })

    // 读取请求 body
    let body = ""

    for await (const chunk of req) {
      body += chunk
    }

    const { prompt } = JSON.parse(body)

    // 流式生成 token
    for await (const token of fakeLLM(prompt)) {

      const payload = {
        delta: token
      }

      res.write(`data: ${JSON.stringify(payload)}\n\n`)
    }

    res.end()

    return
  }

})

server.listen(3000, () => {
  console.log("API running http://localhost:3000")
})