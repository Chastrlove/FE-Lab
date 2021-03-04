let workInProgressHook;
let isMount = true;

const fiber = {
    memoizedState: null,
    stateNode: App
};

function schedule() {
    workInProgressHook = fiber.memoizedState;
    const app = fiber.stateNode();
    isMount = false;
    return app;
}

function dispatchAction(queue, action) {
    const update = {
        action,
        next: null
    }
    if (queue.pending === null) {
        /**
         *
         * queue.pending = u0 ---> u0
         *                  ^       |
         *                  |       |
         *                  ---------
         */
        update.next = update;
    } else {
        /**
         * queue.pending始终指向最后一个插入的update，同时  queue.pending.next指向第一个update
         * queue.pending = u1 ---> u0
         *                  ^       |
         *                  |       |
         *                  ---------
         */
        update.next = queue.pending.next;
        queue.pending.next = update;
    }
    queue.pending = update;

    schedule();
}

function useState(initialState) {
    let hook;

    if (isMount) {
        hook = {
            queue: {
                pending: null
            },
            memoizedState: initialState,
            next: null
        }
        /**
         * workInProgressHook始终指向最后一个插入的hook，同时  queue.pending.next指向第一个update
         *                       workInProgressHook
         *                               ||
         * fiber.memoizedState = hook0 ---> hook1
         */
        if (!fiber.memoizedState) {
            fiber.memoizedState = hook;
        } else {
            workInProgressHook.next = hook;
        }
        workInProgressHook = hook;
    } else {
        //workInProgressHook 指针偏移
        hook = workInProgressHook;
        workInProgressHook = workInProgressHook.next;
    }

    let baseState = hook.memoizedState;
    if (hook.queue.pending) {
        let firstUpdate = hook.queue.pending.next;

        do {
            // 执行该hook中所有的update，执行完后跳出循环
            const action = firstUpdate.action;
            baseState = action(baseState);
            firstUpdate = firstUpdate.next;
        } while (firstUpdate !== hook.queue.pending)

        hook.queue.pending = null;
    }
    hook.memoizedState = baseState;

    return [baseState, dispatchAction.bind(null, hook.queue)];
}

function App() {
    const [num, updateNum] = useState(0);
    const [aaa, updateAAA] = useState('mm');

    console.log(`${isMount ? 'mount' : 'update'} num: `, num);
    console.log(`${isMount ? 'mount' : 'update'} aaa: `, aaa);

    return {
        click() {
            updateNum(num => num + 1);
            updateNum(num => num + 3);
        }
    }
}

const app = schedule();
app.click()
