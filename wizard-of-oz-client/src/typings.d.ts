/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var perfectScrollbar: PerfectScrollbar;
interface PerfectScrollbar {
  reach: object;

  update(): void;
  destroy(): void;
}
