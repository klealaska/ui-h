import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Game, Player } from '@ui-coe/demo/shared/util';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatboxComponent {
  @Input() currentGame$: Observable<Game>;
  @Input() currentPlayer$: Observable<Player>;
  @Input() expanded: boolean;
  @Input() sendMessageForm: UntypedFormGroup;
  @Output() collapseChatEvent = new EventEmitter<void>();
  @Output() sendChatMessageEvent = new EventEmitter<void>();
}
