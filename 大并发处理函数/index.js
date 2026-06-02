/**
 * 并发控制
 * @param {Array<Function>} tasks
 * 每一项必须是返回 Promise 的函数
 *
 * @param {number} max
 * 最大并发数量
 */
function asyncPool(tasks, max = 3) {
    return new Promise((resolve) => {
        // 最终结果
        const results = []

        // 当前执行到的任务下标
        let index = 0

        // 当前完成数量
        let finished = 0

        /**
         * 执行任务
         */
        function run() {
            // 所有任务执行完成
            if (finished === tasks.length) {
                resolve(results)
                return
            }

            // 没有任务可执行
            if (index >= tasks.length) {
                return
            }

            // 记录当前任务下标
            const currentIndex = index

            // 取任务
            const task = tasks[index]

            // 下标递增
            index++

            // 执行任务
            task()
                .then((res) => {
                    results[currentIndex] = res
                })
                .catch((err) => {
                    results[currentIndex] = err
                })
                .finally(() => {
                    // 完成数量 +1
                    finished++

                    // 当前任务结束后
                    // 继续执行下一个任务
                    run()
                })
        }

        // 初始化并发池
        for (let i = 0; i < max; i++) {
            run()
        }
    })
}