import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConnectorService } from '../../../core/services/connector.service';

@Component({
  selector: 'avc-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements OnInit {
  @Input() connectorId: number;

  imageRef: any;

  constructor(private sanitizer: DomSanitizer, private connectorService: ConnectorService) {}

  ngOnInit(): void {
    this.connectorService.getLogo(this.connectorId).subscribe(data => {
      this.imageRef = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
    });
  }
}
