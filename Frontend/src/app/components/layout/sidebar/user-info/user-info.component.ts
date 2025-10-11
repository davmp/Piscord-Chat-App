import { Component, inject, output } from "@angular/core";
import { Router } from "@angular/router";
import type { MenuItem } from "primeng/api";
import { Avatar } from "primeng/avatar";
import { Menu } from "primeng/menu";
import type { Profile } from "../../../../models/user.models";
import { AuthService } from "../../../../services/auth/auth.service";
import { DeviceService } from "../../../../services/device.service";
import * as formThemes from "../../../../themes/form.themes";

@Component({
  selector: "app-user-info",
  imports: [Avatar, Menu],
  templateUrl: "./user-info.component.html",
})
export class UserInfoComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private deviceService = inject(DeviceService);

  user: Profile | null = null; //computed(() => this.authService.profile());
  setOpenModal = output<"createRoom" | "findRooms">();

  visible = false;

  menuThemes = formThemes.menuThemes;
  buttonThemes = formThemes.buttonThemes;

  get actions(): MenuItem[] {
    return [
      {
        label: "Grupos",
        items: [
          {
            label: "Criar",
            icon: "pi pi-plus",
            command: () => this.setOpenModal.emit("createRoom"),
          },
          {
            label: "Pesquisar",
            icon: "pi pi-comments",
            command: () => this.setOpenModal.emit("findRooms"),
          },
        ],
      },
      {
        label: "Conta",
        items: [
          {
            label: "Configurações",
            icon: "pi pi-cog",
            routerLink: "/settings",
          },
          {
            label: "Sair",
            icon: "pi pi-sign-out",
            command: () => this.handleLogout(),
            styleClass:
              "[&_.p-menu-item-content]:text-red-500! [&_.p-menu-item-icon]:text-red-500!",
          },
        ],
      },
    ];
  }

  ngOnInit() {
    this.authService.getProfile();
  }

  handleLogout() {
    this.authService.logout();
    if (this.deviceService.isBrowser) {
      this.router.navigateByUrl("/login");
    }
  }

  isMobile() {
    return this.deviceService.isMobile();
  }
  formattedDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString(["pt-BR"], {
      year: "2-digit",
      month: "long",
      day: "2-digit",
    });
  }
}
