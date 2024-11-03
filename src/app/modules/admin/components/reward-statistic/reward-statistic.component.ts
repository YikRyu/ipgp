import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { catchError, concatMap, EMPTY, generate, map, of, switchMap } from 'rxjs';
import { RewardTransactionsService } from 'src/app/core/services/http/reward-transactions.service';
import { ToastService } from 'src/app/core/services/services/toast.service';

@Component({
  selector: 'app-reward-statistic',
  templateUrl: './reward-statistic.component.html',
  styleUrls: ['./reward-statistic.component.scss'],
})
export class RewardStatisticComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartType: ChartType = 'pie';
  private categories: string[] = [];
  private data: number[] = [];
  private backgroundColor: string[] = [];
  public showLegend: boolean = true;
  public showLabels: boolean = true;
  public isDoughnut: boolean = false;
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  };
  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
  };

  constructor(
    private rewardTransactionService: RewardTransactionsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getRewardStatistics();
  }

  private getRewardStatistics() {
    this.rewardTransactionService.getChartRewardTransactions().subscribe({
      next: (rewardTransactions) => {
        for (let rewardTransaction of rewardTransactions) {
          let rewardsList: any[] = JSON.parse(rewardTransaction.rewards);
          for (let reward of rewardsList) {
            if (this.pieChartData.labels.length > 0) {
              let categoryIndex;
              let originalData;
              let newData;
              const findExistCategory = this.pieChartData.labels.find(
                (label) => label == reward.rewardCategory
              );

              if (findExistCategory) {
                for (let i = 0; i < this.pieChartData.labels.length; i++) {
                  if (this.pieChartData.labels[i] == reward.rewardCategory) {
                    categoryIndex = i;
                    originalData =
                      this.pieChartData.datasets[0].data[categoryIndex];
                    newData = originalData + reward.quantity;
                    this.pieChartData.datasets[0].data[categoryIndex] = newData;
                    this.chart.update();
                  }
                }
              } else {
                this.categories.push(reward.rewardCategory);
                this.pieChartData.labels = this.categories;
                this.data.push(Number(reward.quantity));
                this.pieChartData.datasets[0].data = this.data;
                this.backgroundColor.push(this.generateColor());
                this.pieChartData.datasets[0].backgroundColor = this.backgroundColor;
                this.pieChartData.datasets[0].hoverBackgroundColor = this.backgroundColor;

                this.chart.update();
              }
            } else {
              this.categories.push(reward.rewardCategory);
              this.pieChartData.labels = this.categories;
              this.data.push(Number(reward.quantity));
              this.pieChartData.datasets[0].data = this.data;
              this.backgroundColor.push(this.generateColor());
              this.pieChartData.datasets[0].backgroundColor =
                this.backgroundColor;
              this.pieChartData.datasets[0].hoverBackgroundColor =
                this.backgroundColor;
              this.chart.update();
            }
          }
        }
      },
      error: (error) => {
        this.toastService.showError(
          'Error fetching reward statistics: ' +
            error.message +
            ', ' +
            error.error.message
        );
      },
    });
  }

  private generateColor(): string{
    const randomColorValue = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColorValue}`;
  }
}
