import { Component, inject } from "@angular/core";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
} from "@angular/animations";
import { ToastService } from "src/app/core/services/services/toast.service";

@Component({
  selector: "app-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
  animations: [
    trigger("fade", [
      transition(
        ":enter",
        animate(
          5000,
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 1, transform: "translateY(0)", offset: 0.1 }),
            style({ opacity: 1, transform: "translateY(0)", offset: 0.9 }),
            style({ opacity: 0, transform: "translateY(-20px)", offset: 1.0 }),
          ])
        )
      ),
    ]),
  ],
  host: {
    class: "toast-container position-fixed top-0 end-0 p-3",
    style: "z-index: 1200",
  },
})
export class ToastComponent{
  constructor(
    public toastService: ToastService
  ) {}
}
