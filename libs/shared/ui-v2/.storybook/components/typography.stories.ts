import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'typography',
  template: `
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>

    <p class="ax-b1">Body 1</p>
    <p class="ax-b2">Body 2</p>
    <p class="ax-b3">Body 3</p>
    <p class="ax-b4">Body 4</p>

    <p class="ax-c1">Caption 1</p>
    <p class="ax-c2">Caption 2</p>
    <p class="ax-c3">Caption 3</p>
    <p class="ax-c4">Caption 4</p>

    <table class="ax-b4">
      <thead>
        <tr>
          <th>CSS class</th>
          <th>Native element</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ax-h1</td>
          <td>h1</td>
        </tr>
        <tr>
          <td>ax-h2</td>
          <td>h2</td>
        </tr>
        <tr>
          <td>ax-h3</td>
          <td>h3</td>
        </tr>
        <tr>
          <td>ax-h4</td>
          <td>h4</td>
        </tr>
        <tr>
          <td>ax-h5</td>
          <td>h5</td>
        </tr>
        <tr>
          <td>ax-h6</td>
          <td>h6</td>
        </tr>
        <tr>
          <td>ax-b1</td>
          <td>none</td>
        </tr>
        <tr>
          <td>ax-b2</td>
          <td>none</td>
        </tr>
        <tr>
          <td>ax-b3</td>
          <td>none</td>
        </tr>
        <tr>
          <td>ax-b4</td>
          <td>none</td>
        </tr>
        <tr>
          <td>ax-c1</td>
          <td>none</td>
        </tr>
        <tr>
          <td>ax-c2</td>
          <td>none</td>
        </tr>
        <tr>
          <td>ax-c3</td>
          <td>none</td>
        </tr>
        <tr>
          <td>ax-c4</td>
          <td>none</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [
    `
      table {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        border-collapse: collapse;
      }

      td,
      th {
        padding: 4px 16px;
        border: 1px solid rgba(0, 0, 0, 0.12);
      }

      th {
        background-color: theme('colors.onSurface.50');
        text-align: start;
      }
    `,
  ],
})
class typographyComponent {}

export default {
  component: typographyComponent,
  title: 'Components/Typography',
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<typographyComponent> = (args: typographyComponent) => ({
  props: { ...args },
});

export const Default = Template.bind({});
Default.args = {};
