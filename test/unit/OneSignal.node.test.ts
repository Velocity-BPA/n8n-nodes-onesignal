/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { OneSignal } from '../../nodes/OneSignal/OneSignal.node';
import { OneSignalTrigger } from '../../nodes/OneSignal/OneSignalTrigger.node';

describe('OneSignal Node', () => {
  let oneSignalNode: OneSignal;

  beforeEach(() => {
    oneSignalNode = new OneSignal();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(oneSignalNode.description.displayName).toBe('OneSignal');
    });

    it('should have correct name', () => {
      expect(oneSignalNode.description.name).toBe('oneSignal');
    });

    it('should have correct version', () => {
      expect(oneSignalNode.description.version).toBe(1);
    });

    it('should require oneSignalApi credentials', () => {
      expect(oneSignalNode.description.credentials).toEqual([
        {
          name: 'oneSignalApi',
          required: true,
        },
      ]);
    });

    it('should have correct inputs and outputs', () => {
      expect(oneSignalNode.description.inputs).toEqual(['main']);
      expect(oneSignalNode.description.outputs).toEqual(['main']);
    });
  });

  describe('Resources', () => {
    it('should have 8 resources defined', () => {
      const resourceProperty = oneSignalNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      expect(resourceProperty).toBeDefined();
      expect(resourceProperty?.type).toBe('options');
      expect((resourceProperty as any).options).toHaveLength(8);
    });

    it('should have notification resource', () => {
      const resourceProperty = oneSignalNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const notificationOption = (resourceProperty as any).options.find(
        (o: any) => o.value === 'notification'
      );
      expect(notificationOption).toBeDefined();
      expect(notificationOption.name).toBe('Notification');
    });

    it('should have user resource', () => {
      const resourceProperty = oneSignalNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const userOption = (resourceProperty as any).options.find(
        (o: any) => o.value === 'user'
      );
      expect(userOption).toBeDefined();
      expect(userOption.name).toBe('User');
    });

    it('should have subscription resource', () => {
      const resourceProperty = oneSignalNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const subscriptionOption = (resourceProperty as any).options.find(
        (o: any) => o.value === 'subscription'
      );
      expect(subscriptionOption).toBeDefined();
      expect(subscriptionOption.name).toBe('Subscription');
    });

    it('should have segment resource', () => {
      const resourceProperty = oneSignalNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const segmentOption = (resourceProperty as any).options.find(
        (o: any) => o.value === 'segment'
      );
      expect(segmentOption).toBeDefined();
      expect(segmentOption.name).toBe('Segment');
    });

    it('should have template resource', () => {
      const resourceProperty = oneSignalNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const templateOption = (resourceProperty as any).options.find(
        (o: any) => o.value === 'template'
      );
      expect(templateOption).toBeDefined();
      expect(templateOption.name).toBe('Template');
    });

    it('should have app resource', () => {
      const resourceProperty = oneSignalNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const appOption = (resourceProperty as any).options.find(
        (o: any) => o.value === 'app'
      );
      expect(appOption).toBeDefined();
      expect(appOption.name).toBe('App');
    });

    it('should have outcome resource', () => {
      const resourceProperty = oneSignalNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const outcomeOption = (resourceProperty as any).options.find(
        (o: any) => o.value === 'outcome'
      );
      expect(outcomeOption).toBeDefined();
      expect(outcomeOption.name).toBe('Outcome');
    });

    it('should have export resource', () => {
      const resourceProperty = oneSignalNode.description.properties.find(
        (p) => p.name === 'resource'
      );
      const exportOption = (resourceProperty as any).options.find(
        (o: any) => o.value === 'export'
      );
      expect(exportOption).toBeDefined();
      expect(exportOption.name).toBe('Export');
    });
  });

  describe('Load Options Methods', () => {
    it('should have getSegments method', () => {
      expect(oneSignalNode.methods?.loadOptions?.getSegments).toBeDefined();
    });

    it('should have getTemplates method', () => {
      expect(oneSignalNode.methods?.loadOptions?.getTemplates).toBeDefined();
    });
  });
});

describe('OneSignal Trigger Node', () => {
  let triggerNode: OneSignalTrigger;

  beforeEach(() => {
    triggerNode = new OneSignalTrigger();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(triggerNode.description.displayName).toBe('OneSignal Trigger');
    });

    it('should have correct name', () => {
      expect(triggerNode.description.name).toBe('oneSignalTrigger');
    });

    it('should be in trigger group', () => {
      expect(triggerNode.description.group).toContain('trigger');
    });

    it('should have no inputs', () => {
      expect(triggerNode.description.inputs).toEqual([]);
    });

    it('should have one output', () => {
      expect(triggerNode.description.outputs).toEqual(['main']);
    });
  });

  describe('Events', () => {
    it('should have event options defined', () => {
      const eventProperty = triggerNode.description.properties.find(
        (p) => p.name === 'event'
      );
      expect(eventProperty).toBeDefined();
      expect(eventProperty?.type).toBe('options');
    });

    it('should include notification events', () => {
      const eventProperty = triggerNode.description.properties.find(
        (p) => p.name === 'event'
      );
      const options = (eventProperty as any).options;
      
      expect(options.find((o: any) => o.value === 'notification.clicked')).toBeDefined();
      expect(options.find((o: any) => o.value === 'notification.confirmed')).toBeDefined();
      expect(options.find((o: any) => o.value === 'notification.sent')).toBeDefined();
    });

    it('should include all events option', () => {
      const eventProperty = triggerNode.description.properties.find(
        (p) => p.name === 'event'
      );
      const allOption = (eventProperty as any).options.find(
        (o: any) => o.value === 'all'
      );
      expect(allOption).toBeDefined();
    });
  });

  describe('Webhook Configuration', () => {
    it('should have webhook defined', () => {
      expect(triggerNode.description.webhooks).toHaveLength(1);
    });

    it('should use POST method', () => {
      expect(triggerNode.description.webhooks?.[0].httpMethod).toBe('POST');
    });

    it('should have correct webhook path', () => {
      expect(triggerNode.description.webhooks?.[0].path).toBe('webhook');
    });
  });
});
