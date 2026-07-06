// 4막 진행 표시 — 여정의 현재 위치를 막(act) 단위로 보여준다.

const ACTS = ["나를 마주하기", "되고 싶은 나", "살아내기", "표현하기"];

export function ActsProgress({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex gap-2 my-6">
      {ACTS.map((label, i) => {
        const no = (i + 1) as 1 | 2 | 3 | 4;
        const state =
          no < current ? "done" : no === current ? "active" : "todo";
        return (
          <div key={label} className="flex-1">
            <div
              className={`h-1 rounded-full mb-1.5 ${
                state === "done"
                  ? "bg-accent"
                  : state === "active"
                    ? "bg-accent/50"
                    : "bg-line"
              }`}
            />
            <p
              className={`text-[11px] ${
                state === "active" ? "text-accent" : "text-muted"
              } hidden sm:block`}
            >
              {i + 1}막 {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
