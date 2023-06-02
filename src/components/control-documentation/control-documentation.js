import { Card } from 'react-bootstrap';

const { Body, Text } = Card;

export const ControlDocumentation = () => {
  return (
    <Card>
      <Body>
        <Text>
          Left-click and drag:
          <ul>
            <li>Draw a bounding box to segment an object using the current label.</li>
            <li>Hold Ctrl/Cmd to overwrite previous segmentations.</li>
          </ul>

          Left-click:
          <ul>
            <li>Confirm current segmentation.</li>
            <li>Click the background to generate a new label or an object to continue editing that object.</li>           
            <li>Hold Shift (background) or Alt (foreground) instead to add points to modify current segmentation.</li>
          </ul>

          Right-click:
          <ul>
            <li>Click on an object to remove all pixels with that label from the current slice.</li>
          </ul>
          <div>Mouse wheel:</div>
          <ul>
            <li>Change slice</li>
            <li>Also confirms current segmentation and keeps current label.</li>
          </ul>
          
          Esc:
          <ul>
            <li>Cancel current segmentation</li>
          </ul>
        </Text>
      </Body>
    </Card>
  );
};