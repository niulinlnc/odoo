odoo.define('test_main_flows.tour', function (require) {
"use strict";

const {_t} = require('web.core');
const tour = require('web_tour.tour');

tour.register('main_flow_tour', {
    test: true,
    url: "/web",
}, [
...tour.stepUtils.goToAppSteps('sale.sale_menu_root', _t('Organize your sales activities with the <b>Sales app</b>.')),
tour.stepUtils.openBuggerMenu("li.breadcrumb-item.active:contains('Quotations')"),
{
// Add Stockable product
    trigger: ".o_menu_sections a:contains('Products')",
    extra_trigger: '.o_main_navbar',
    content: _t("Let's create products."),
    position: "bottom",
}, {
    trigger: ".o_menu_sections a:has(span:contains('Products'))",
    content: _t("Let's create products."),
    position: "bottom"
}, {
    trigger: '.o-kanban-button-new',
    extra_trigger: "li.breadcrumb-item.active:contains('Products')",
    content: _t("Let's create your first product."),
    position: 'bottom',
}, {
    trigger: 'input[name=name]',
    extra_trigger: '.o_form_sheet',
    content: _t("Let's enter the name."),
    position: 'left',
    run: 'text the_flow.product',
}, {
    trigger: "select[name=type]",
    content: _t("Let's enter the product type"),
    position: 'left',
    run: 'text "product"',
}, {
    trigger: '.o_notebook a:contains("Inventory")',
    content: _t('Go to inventory tab'),
    position: 'top',
}, {
    trigger: '.o_field_widget[name=route_ids] .custom-checkbox > label:contains("Manufacture")',
    content: _t('Check Manufacture'),
    position: 'right',
}, {
    trigger: '.o_field_widget[name=route_ids] .custom-checkbox > label:contains("Buy")',
    content: _t('Uncheck Buy'),
    position: 'right',
}, {
    trigger: '.o_field_widget[name=route_ids] .custom-checkbox > label:contains("Replenish on Order (MTO)")',
    content: _t('Uncheck  Replenish on Order (MTO)'),
    position: 'right',
}, {
    trigger: '.o_notebook a:contains("General Information")',
    content: _t('Go to main tab'),
    position: 'top',
}, {
    mobile: false,
    trigger: ".o_field_widget[name=taxes_id] input",
    content: _t("Focus on customer taxes field."),
    run: function (actions) {
        actions.click();
        const $e = $('.ui-menu-item:not(.o_m2o_dropdown_option) > a.ui-state-active');
        if ($e.length) {
            actions.click($e);
        } else {
            actions.click(); // close dropdown
        }
    },
}, {
    trigger: '.o_form_button_save',
    content: _t("Save this product and the modifications you've made to it."),
    position: 'bottom',
},
tour.stepUtils.autoExpandMoreButtons('.o_form_readonly'),
{
    trigger: ".oe_button_box .oe_stat_button:has(div[name=bom_count])",
    extra_trigger: '.o_form_readonly',
    content: _t('See Bill of material'),
    position: 'bottom',
}, {
    trigger: ".o_list_button_add",
    content: _t("Let's create a new bill of material"),
    position: "bottom",
}, {
// Add first component
    // FIXME in mobile replace list by kanban + form
    trigger: ".o_field_x2many_list_row_add > a",
    extra_trigger: ".o_form_editable",
    content: _t("Click here to add some lines."),
    position: "bottom",
}, {
    mobile: false,
    trigger: ".o_selected_row .o_required_modifier[name=product_id] input",
    content: _t("Select a product, or create a new one on the fly."),
    position: "right",
    run: "text the_flow.component1",
}, {
    mobile: false,
    trigger: ".ui-menu-item > a:contains('the_flow.component1')",
    auto: true,
}, {
    mobile: true,
    trigger: ".o_selected_row .o_required_modifier[name=product_id] input",
    content: _t("Click here to open kanban search mobile."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".modal-dialog .btn:contains('Create')",
    extra_trigger: ".modal-dialog",
    content: _t("Click here to add new line."),
    position: "left",
}, {
    mobile: true,
    trigger: '.modal-body .o_form_editable .o_field_widget.o_input[name="name"]',
    content: _t("Select a product, or create a new one on the fly."),
    position: "right",
    run: "text the_flow.component1",
}, {
// Edit first component
    mobile: false,
    trigger: ".o_selected_row .o_external_button",
    content: _t("Click here to edit your component"),
    position: "right",
}, {
    trigger: '.o_notebook a:contains("Inventory")',
    content: _t('Go to inventory tab'),
    position: 'top',
}, {
    trigger: '.o_field_widget[name=route_ids] .custom-checkbox > label:contains("Replenish on Order (MTO)")',
    content: _t('Check Replenish on Order (MTO)'),
    position: 'right',
}, {
    trigger: '.o_notebook a:contains("Purchase")',
    content: _t('Go to purchase tab'),
    position: 'top',
}, {
    mobile: false,
    trigger: ".o_field_widget[name=seller_ids] .o_field_x2many_list_row_add > a",
    content: _t("Let's enter the cost price"),
    position: 'right',
}, {
    mobile: false,
    trigger: ".o_field_widget[name=name] input",
    extra_trigger: ".modal-dialog",
    content: _t('Select a seller'),
    position: 'top',
    run: "text the_flow.vendor",
}, {
    mobile: false,
    trigger: ".ui-menu-item > a:contains('the_flow.vendor')",
    in_modal: false,
}, {
    mobile: true,
    trigger: ".o_field_widget[name=seller_ids] .o-kanban-button-new",
    content: _t("Let's select a vendor"),
    position: 'bottom',
}, {
    mobile: true,
    trigger: ".o_form_editable .o_field_many2one[name=name] input",
    extra_trigger: ".modal:not(.o_inactive_modal) .o_form_editable div:contains('Vendor')",
    content: _t("Select a vendor, or create a new one on the fly."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".modal-footer .btn:contains('Create')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Vendor')",
    content: _t("Select a vendor, or create a new one on the fly."),
    position: "right",
}, {
    mobile: true,
    trigger: ".modal-dialog .o_field_widget[name=name] input",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-dialog .o_field_radio.o_field_widget[name=company_type]",
    content: _t('Select a seller'),
    position: 'top',
    run: "text the_flow.vendor",
}, {
    mobile: true,
    trigger: '.btn:has(:contains(Save))',
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Vendor')",
    content: _t("Save this product and the modifications you've made to it."),
    position: 'right',
}, {
    trigger: ".o_field_widget[name=price]",
    content: _t('Set the cost price'),
    position: 'right',
    run: "text 1",
}, {
    mobile: true,
    trigger: ".modal-footer .btn-primary:contains('Save & Close')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Vendor')",
    content: _t('Save & Close'),
    position: 'right',
}, {
    mobile: true,
    trigger: ".modal-footer .btn-primary:contains('Save')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Component')",
    content: _t('Save'),
    position: 'right',
}, {
    mobile: true,
    trigger: '.o_field_widget[name=code]',
    extra_trigger: ".o_field_widget[name=product_id] > .o_external_button", // Wait name_create
    // click somewhere else to exit cell focus
}, {
    mobile: false,
    trigger: 'label:contains("Vendor Taxes")',
    extra_trigger: ".o_field_widget[name=name] > .o_external_button", // Wait name_create
    // click somewhere else to exit cell focus
}, {
    mobile: false,
    trigger: ".modal-footer .btn-primary",
    content: _t('Save'),
    position: 'bottom',
}, {
// Add second component
    mobile: false,
    trigger: ".o_field_x2many_list_row_add > a",
    extra_trigger: "body:not(:has(table.o_list_table div.o_field_widget[name='product_id'] input))",
    content: _t("Click here to add some lines."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".o_field_x2many_list_row_add > a",
    extra_trigger: ".o_form_editable",
    content: _t("Click here to add some lines."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".o_selected_row .o_required_modifier[name=product_id] input",
    content: _t("Click here to open kanban search mobile."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".modal-dialog .btn:contains('Create')",
    extra_trigger: ".modal-dialog",
    content: _t("Click here to add new line."),
    position: "left",
}, {
    mobile: true,
    trigger: ".modal-body .o_form_editable .o_field_widget.o_input[name=\"name\"]",
    content: _t("Select a product, or create a new one on the fly."),
    position: "right",
    run: "text the_flow.component2",
}, {
    mobile: false,
    trigger: ".o_selected_row .o_required_modifier[name=product_id] input",
    extra_trigger: '.o_field_widget[name=bom_line_ids] .o_data_row:nth(1).o_selected_row',
    content: _t("Select a product, or create a new one on the fly."),
    position: "right",
    run: "text the_flow.component2",
}, {
    mobile: false,
    trigger: ".ui-menu-item > a:contains('the_flow.component2')",
    auto: true,
}, {
// Edit second component
    mobile: false,
    trigger: ".o_selected_row .o_external_button",
    content: _t("Click here to edit your component"),
    position: "right",
}, {
    trigger: '.o_notebook a:contains("Purchase")',
    content: _t('Go to purchase tab'),
    position: 'top',
}, {
    mobile: true,
    trigger: ".o_field_widget[name=seller_ids] .o-kanban-button-new",
    content: _t("Let's select a vendor"),
    position: 'bottom',
}, {
    mobile: true,
    trigger: '.o_form_editable .o_field_many2one[name="name"] input',
    extra_trigger: ".modal:not(.o_inactive_modal) .o_form_editable div:contains('Vendor')",
    content: _t("Select a vendor, or create a new one on the fly."),
    position: "bottom",
},
...tour.stepUtils.mobileKanbanSearchMany2X('Vendor', 'the_flow.vendor'),
{
    mobile: false,
    trigger: ".o_field_widget[name=seller_ids] .o_field_x2many_list_row_add > a",
    content: _t("Let's enter the cost price"),
    position: 'right',
}, {
    mobile: false,
    trigger: ".o_field_widget[name=name] input",
    extra_trigger: ".modal-dialog",
    content: _t('Select a seller'),
    position: 'top',
    run: "text the_flow.vendor",
}, {
    mobile: false,
    trigger: ".ui-menu-item > a:contains('the_flow.vendor')",
    auto: true,
    in_modal: false,
}, {
    trigger: ".o_field_widget[name=price]",
    content: _t('Set the cost price'),
    position: 'right',
    run: "text 1",
}, {
    mobile: true,
    trigger: ".modal-footer .btn-primary:contains('Save & Close')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Vendor')",
    content: _t('Save & Close'),
    position: 'right',
}, {
    mobile: true,
    trigger: ".modal-footer .btn-primary:contains('Save')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Component')",
    content: _t('Save'),
    position: 'right',
}, {
    mobile: true,
    trigger: '.o_field_widget[name=code]',
    extra_trigger: ".o_field_widget[name=product_id] > .o_external_button", // Wait name_create
    // click somewhere else to exit cell focus
}, {
    mobile: false,
    trigger: 'label:contains("Vendor Taxes")',
    // click somewhere else to exit cell focus
}, {
    mobile: false,
    trigger: ".modal-footer .btn-primary",
    extra_trigger: ".o_field_widget[name=seller_ids] .o_data_row td:nth-child(2):contains('the_flow.vendor')",
    content: _t('Save'),
    position: 'bottom',
}, {
    trigger: '.o_form_button_save',
    extra_trigger: ".o_field_widget[name=bom_line_ids] .o_list_view tr:nth-child(3):has(.o_field_x2many_list_row_add)",
    content: _t('Save the bom.'),
    position: 'bottom',
}, {
    mobile: false,
    trigger: ".breadcrumb-item:first",
    content: _t("Use the breadcrumbs to <b>go back to products</b>."),
    position: "bottom"
},
...tour.stepUtils.goBackBreadcrumbsMobile(
        _t("Use the breadcrumbs to <b>go back to products</b>."),
        undefined,
        ".breadcrumb-item.active:contains('Bill of Materials')",
        ".breadcrumb-item.active:contains('the_flow.product')"
    ),
{
// Add service product
    trigger: '.o-kanban-button-new',
    extra_trigger: '.o_kanban_view',
    content: _t("Let's create your second product."),
    position: 'bottom',
}, {
    trigger: 'input[name=name]',
    extra_trigger: '.o_form_sheet',
    content: _t("Let's enter the name."),
    position: 'left',
    run: 'text the_flow.service',
}, {
    trigger: '.o_field_widget[name=type]',
    content: _t('Set to service'),
    position: 'left',
    run: 'text "service"',
}, {
    mobile: false,
    trigger: ".o_field_widget[name=taxes_id] input",
    content: _t("Focus on customer taxes field."),
    run: function (actions) {
        actions.click();
        const $e = $('.ui-menu-item:not(.o_m2o_dropdown_option) > a.ui-state-active');
        if ($e.length) {
            actions.click($e);
        } else {
            actions.click(); // close dropdown
        }
    },
}, {
    trigger: '.o_notebook a:contains("Sales")',
    content: _t('Go to sales tab'),
    position: 'bottom',
}, {
    trigger: '.o_field_widget[name=service_policy] .o_radio_input[data-value="delivered_timesheet"]',
    content: _t('Change service policy'),
    position: 'left',
}, {
    trigger: '.o_field_widget[name=service_tracking] input[data-value="task_global_project"]',
    content: _t('Change track service'),
    position: 'left',
}, {
    mobile: false,
    trigger: '.o_field_widget[name=project_id] input',
    content: _t('Choose project'),
    position: 'left',
    run: 'text the_flow.project',
}, {
    mobile: true,
    trigger: '.o_field_widget[name=project_id] input',
    content: _t('Choose project'),
    position: 'left',
}, {
    mobile: true,
    trigger: ".modal-dialog .btn:contains('Create')",
    extra_trigger: ".modal-dialog",
    content: _t("Click here to add new line."),
    position: "left",
}, {
    mobile: true,
    trigger: 'input[name=name]',
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Project')",
    content: _t('Let\'s enter the name.'),
    position: 'left',
    run: 'text the_flow.project',
}, {
    mobile: false,
    trigger: ".ui-menu-item > a:contains('the_flow.project')",
    auto: true,
}, {
    mobile: true,
    trigger: ".modal-footer .btn-primary:contains('Save')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Project')",
    content: _t('Save'),
    position: 'right',
}, {
    trigger: '.o_form_button_save',
    extra_trigger: '.o_field_widget[name=project_id] > .o_external_button', // Wait name_create
    content: _t("Save this product and the modifications you've made to it."),
    position: 'bottom',
}, {
// Create an opportunity
    edition: "enterprise",
    trigger: '.o_menu_toggle',
    content: _t('Go back to the home menu'),
    position: 'bottom',
},
...tour.stepUtils.goToAppSteps('crm.crm_menu_root', _t('Organize your sales activities with the <b>CRM app</b>.')),
{
    trigger: ".o-kanban-button-new",
    extra_trigger: '.o_opportunity_kanban',
    content: _t("Click here to <b>create your first opportunity</b> and add it to your pipeline."),
    position: "bottom"
}, {
    trigger: ".o_kanban_quick_create input:first",
    content: _t("<b>Choose a name</b> for your opportunity."),
    position: "right",
    run: "text the_flow.opportunity",
}, {
    mobile: false,
    trigger: ".o_kanban_quick_create .o_field_widget[name=partner_id] input",
    content: _t("Write the name of your customer to create one on the fly, or select an existing one."),
    position: "left",
    run: "text the_flow.customer",
}, {
    mobile: true,
    trigger: ".o_kanban_quick_create .o_field_widget[name=partner_id] input",
    content: _t("Write the name of your customer to create one on the fly, or select an existing one."),
    position: "left",
}, {
    mobile: true,
    trigger: ".modal-dialog .btn:contains('Create')",
    extra_trigger: ".modal-dialog",
    content: _t("Click here to add new line."),
    position: "left",
}, {
    mobile: true,
    trigger: '.o_field_widget[name=name] input',
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Customer')",
    content: _t('Let\'s enter the name.'),
    position: 'left',
    run: 'text the_flow.customer',
}, {
    mobile: false,
    trigger: ".ui-menu-item > a:contains('the_flow.customer')",
    auto: true,
}, {
    mobile: true,
    trigger: ".modal-footer .btn-primary:contains('Save')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Customer')",
    content: _t('Save'),
    position: 'right',
}, {
    trigger: ".o_kanban_quick_create .o_kanban_add",
    extra_trigger: ".o_kanban_quick_create .o_field_widget[name=partner_id] > .o_external_button", // Wait name_create
    content: _t("Click here to <b>add your opportunity</b>."),
    position: "right",
}, {
    mobile: false,
    trigger: ".o_kanban_group:first .o_kanban_record:has(span:contains('the_flow.opportunity'))",
    content: _t("<b>Drag &amp; drop opportunities</b> between columns as you progress in your sales cycle."),
    position: "right",
    run: "drag_and_drop .o_opportunity_kanban .o_kanban_group:eq(2) ",
}, {
    mobile: false,
    trigger: ".o_kanban_group:eq(2) > .o_kanban_record:has(span:contains('the_flow.opportunity'))",
    content: _t("Click on an opportunity to zoom to it."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".o_kanban_group:first .o_kanban_record:has(span:contains('the_flow.opportunity'))",
    content: _t("Open the_flow.opportunity"),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".o_statusbar_status .btn.dropdown-toggle:contains(New)",
    content: _t("Change status from New to proposition."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".o_statusbar_status .btn:contains(Proposition)",
    content: _t("Change status from New to proposition."),
    position: "bottom",
},
// Create a quotation
...tour.stepUtils.statusbarButtonsSteps('New Quotation', _t('<p><b>Create a quotation</p>')),
{
    mobile: false,
    trigger: ".o_field_widget[name=order_line] .o_field_x2many_list_row_add > a",
    content: _t("Click here to add some lines to your quotations."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".o_field_widget[name=order_line] .btn:contains(Add)",
    content: _t("Click here to add some lines to your quotations."),
    position: "bottom",
}, {
    /**
     * We need both triggers because the "sale_product_configurator" module replaces the
     * "product_id" field with a "product_template_id" field.
     * This selector will still only ever select one element.
     */
    mobile: false,
    trigger: ".o_field_widget[name=product_id] input, .o_field_widget[name=product_template_id] input",
    content: _t("Select a product, or create a new one on the fly. The product will define the default sales price (that you can change), taxes and description automatically."),
    position: "right",
    run: function (actions) {
        actions.text("the_flow.product", this.$anchor);
        // fake keydown to trigger search
        const keyDownEvent = $.Event("keydown");
        keyDownEvent.which = 42;
        this.$anchor.trigger(keyDownEvent);
        const $descriptionElement = $('.o_form_editable textarea[name="name"]');
        // when description changes, we know the product has been loaded
        $descriptionElement.on('change', function () {
            if ($(this).val().indexOf('the_flow.product') !== -1) {
                $(this).addClass('product_loading_success');
            }
        });
    },
}, {
    mobile: false,
    trigger: ".ui-menu-item > a:contains('the_flow.product')",
}, {
    mobile: false,
    trigger: '.o_form_editable textarea[name="name"].product_loading_success',
    run: function () {} // wait for product loading
}, {
    mobile: true,
    trigger: ".o_field_widget[name=product_id] input",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Order Lines')",
    content: _t("Select a product, or create a new one on the fly. The product will define the default sales price (that you can change), taxes and description automatically."),
    position: "right",
},
...tour.stepUtils.mobileKanbanSearchMany2X('Product', 'the_flow.product'),
{
    mobile: false,
    trigger: ".o_field_widget[name=order_line] .o_field_x2many_list_row_add > a",
    content: _t("Click here to add some lines to your quotations."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".modal-footer .btn-primary:contains('Save & New')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Order Lines')",
    content: _t('Save & New'),
    position: 'right',
}, {
    /**
     * We need both triggers because the "sale_product_configurator" module replaces the
     * "product_id" field with a "product_template_id" field.
     * This selector will still only ever select one element.
     */
    mobile: false,
    trigger: ".o_field_widget[name=product_id] input, .o_field_widget[name=product_template_id] input",
    extra_trigger: '.o_field_widget[name=order_line] .o_data_row:nth(1).o_selected_row',
    content: _t("Select a product"),
    position: "right",
    run: function (actions) {
        actions.text("the_flow.service", this.$anchor);
        // fake keydown to trigger search
        const keyDownEvent = $.Event("keydown");
        keyDownEvent.which = 42;
        this.$anchor.trigger(keyDownEvent);
        const $descriptionElement = $('.o_form_editable textarea[name="name"]');
        // when description changes, we know the product has been loaded
        $descriptionElement.on('change', function () {
            if ($(this).val().indexOf('the_flow.service') !== -1) {
                $(this).addClass('product_service_loading_success');
            }
        });
    },
}, {
    mobile: false,
    trigger: ".ui-menu-item > a:contains('the_flow.service')",
}, {
    mobile: false,
    trigger: '.o_form_editable textarea[name="name"].product_service_loading_success',
    run: function () {} // wait for product loading
}, {
    mobile: false,
    trigger: 'label:contains("Untaxed Amount")',
    // click somewhere else to exit cell focus
}, {
    mobile: true,
    trigger: ".o_field_widget[name=product_id] input",
    extra_trigger: '.o_field_x2many_kanban[name=order_line] .oe_kanban_card:contains(the_flow.product)',
    content: _t("Select a product, or create a new one on the fly. The product will define the default sales price (that you can change), taxes and description automatically."),
    position: "right",
},
...tour.stepUtils.mobileKanbanSearchMany2X('Product', 'the_flow.service'),
{
    mobile: true,
    trigger: ".modal-footer .btn-primary:contains('Save & Close')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Order Lines')",
    content: _t('Save & Close'),
    position: 'right',
},
...tour.stepUtils.statusbarButtonsSteps('Send by Email', _t("Try to send it to email"), ".o_statusbar_status .btn-primary:contains('Quotation')"),
{
    trigger: ".o_field_widget[name=email]",
    content: _t("Enter an email address"),
    position: "right",
    run: "text test@the_flow.com",
}, {
    trigger: ".modal-footer .btn-primary",
    content: _t("Save your changes"),
    position: "bottom",
}, {
    trigger: ".modal-footer .btn-primary span:contains('Send')",
    content: _t("Try to send it to email"),
    position: "bottom",
},
...tour.stepUtils.statusbarButtonsSteps('Confirm', _t("<p>Confirm this quotation</p>")),
{
    trigger: ".o_form_button_save",
    extra_trigger: ".o_statusbar_status .btn-primary:contains('Sales Order')",
    content: _t("<p>Save this quotation</p>"),
    position: "bottom"
// Reordering rule
}, {
    edition: "enterprise",
    trigger: '.o_menu_toggle',
    content: _t('Go back to the home menu'),
    position: 'bottom',
},
...tour.stepUtils.goToAppSteps('stock.menu_stock_root', _t('Go to Inventory')),
tour.stepUtils.openBuggerMenu("li.breadcrumb-item.active:contains('Inventory Overview')"),
{
    trigger: ".o_menu_sections a:contains('Master Data')",
    extra_trigger: '.o_main_navbar',
    content: _t("Go to Master Data"),
    position: "bottom"
}, {
    trigger: ".o_menu_sections a[data-menu-xmlid='stock.menu_reordering_rules_config']",
    content: _t("Reordering Rules"),
    position: "bottom"
}, {
    mobile: false,
    trigger: ".o_list_button_add",
    content: _t("Let's create a new reordering rule"),
    position: "right",
}, {
    mobile: true,
    trigger: ".o-kanban-button-new",
    content: _t("Let's create a new reordering rule"),
    position: "right",
}, {
    mobile: false,
    trigger: ".o_field_widget[name=product_id] input",
    content: _t("Write the name of your product."),
    position: "top",
    run: "text the_flow.component2",
}, {
    mobile: false,
    trigger: ".ui-menu-item > a:contains('the_flow.component2')",
    auto: true,
}, {
    mobile: true,
    trigger: ".o_field_widget[name=product_id] input",
    content: _t("Write the name of your product."),
    position: "top",
},
...tour.stepUtils.mobileKanbanSearchMany2X('Product', 'the_flow.component2'),
{
    trigger: ".o_field_widget[name=product_min_qty]",
    content: _t("Set the minimum product quantity"),
    position: "right",
    run: 'text 1',
}, {
    trigger: ".o_field_widget[name=product_max_qty]",
    content: _t("Set the maximum product quantity"),
    position: "right",
    run: 'text 10',
}, {
    trigger: ".o_form_button_save",
    content: _t("<p>Save this reordering rule</p>"),
    position: "bottom"
},
tour.stepUtils.openBuggerMenu("li.breadcrumb-item.active:contains('OP/')"),
{
// Run the schedulers
    trigger: ".o_menu_sections a:contains('Operations')",
    content: _t("Go to Run Schedulers"),
    position: "bottom"
}, {
    trigger: ".o_menu_sections a[data-menu-xmlid='stock.menu_procurement_compute']",
    content: _t("Click on schedulers"),
    position: "bottom"
}, {
    trigger: ".modal-footer .btn-primary",
    extra_trigger: ".modal-dialog",
    content: _t("Run Schedulers"),
    position: "bottom",
}, {
//Go to purchase:
    edition: "enterprise",
    trigger: '.o_menu_toggle',
    content: _t('Go back to the home menu'),
    position: 'bottom',
},
...tour.stepUtils.goToAppSteps('purchase.menu_purchase_root', _t('Go to Purchase')),
{
    mobile: false,
    trigger: '.o_data_row:has(.o_data_cell:contains("the_flow.vendor"))',
    content: _t('Select the generated request for quotation'),
    position: 'bottom',
}, {
    mobile: true,
    trigger: '.o_kanban_record:has(.o_kanban_record_title:contains("the_flow.vendor"))',
    content: _t('Select the generated request for quotation'),
    position: 'bottom',
},
...tour.stepUtils.statusbarButtonsSteps('Confirm Order', _t("Confirm quotation")),
...tour.stepUtils.statusbarButtonsSteps('Receive Products', _t("Receive Product"), ".o_statusbar_status .btn.dropdown-toggle:contains('Purchase Order')"),
...tour.stepUtils.statusbarButtonsSteps('Validate', _t("Validate"), ".o_statusbar_status .btn.dropdown-toggle:contains('Ready')"),
{
    trigger: ".modal-footer .btn-primary",
    extra_trigger: ".modal-dialog",
    content: _t("Apply"),
    position: "bottom",
}, {
    trigger: ".o_back_button a, .breadcrumb-item:not('.active'):last",
    content: _t('go back to the purchase order'),
    position: 'bottom',
},
...tour.stepUtils.statusbarButtonsSteps('Create Bill', _t('go to Vendor Bills'), ".o_statusbar_status .btn.dropdown-toggle:contains('Purchase Order')"),
...tour.stepUtils.statusbarButtonsSteps('Post', _t("Try to send it to email"), ".o_statusbar_status .btn.dropdown-toggle:contains('Draft')"),
...tour.stepUtils.statusbarButtonsSteps('Register Payment', _t("Register Payment"), ".o_statusbar_status .btn.dropdown-toggle:contains('Posted')"),
{
    trigger: ".modal-footer .btn-primary",
    content: _t("Validate"),
    position: "bottom",
}, {
    edition: "enterprise",
    trigger: '.o_menu_toggle',
    content: _t('Go back to the home menu'),
    position: 'bottom',
},
...tour.stepUtils.goToAppSteps('mrp.menu_mrp_root', _t('Go to Manufacturing')),
tour.stepUtils.openBuggerMenu("li.breadcrumb-item.active:contains('Manufacturing Orders'), li.breadcrumb-item.active:contains('Work Centers Overview')"),
{
    mobile: false,
    trigger: ".o_menu_sections a[data-menu-xmlid='mrp.menu_mrp_manufacturing']",
    content: _t('Click on Operations menuitem'),
    position: 'bottom',
}, {
    mobile: false,
    trigger: ".o_menu_sections a[data-menu-xmlid='mrp.menu_mrp_production_action']",
    content: _t('Open manufacturing orders'),
    position: 'bottom',
}, {
    mobile: false,
    trigger: '.o_data_row:has(.o_data_cell:contains("the_flow.product")):first',
    content: _t('Select the generated manufacturing order'),
    position: 'bottom',
}, {
    mobile: true,
    trigger: ".o_menu_sections a:contains('Operations')",
    extra_trigger: '.o_main_navbar',
    content: _t("Let's go to manufacturing order."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".o_menu_sections a:has(span:contains('Manufacturing Orders'))",
    content: _t("Let's go to manufacturing order."),
    position: "bottom"
}, {
    mobile: true,
    trigger: '.o_kanban_record:has(.o_kanban_record_title:contains("the_flow.product")):first',
    extra_trigger: "li.breadcrumb-item.active:contains('Manufacturing Orders')",
    content: _t('Select the generated manufacturing order'),
    position: 'bottom',
},
...tour.stepUtils.statusbarButtonsSteps('Check availability', _t("Check availability")),
...tour.stepUtils.statusbarButtonsSteps('Produce', _t("Produce"), "body.o_web_client:not(.oe_wait)"),
{
    mobile: false,
    trigger: ".modal-footer .btn-primary:nth-child(3)",
    content: _t('Record Production'),
    position: 'bottom',
}, {
    mobile: true,
    trigger: '.modal-footer .btn-primary[name="do_produce"]:not(.o_invisible_modifier)',
    content: _t('Record Production'),
    position: 'bottom',
},
...tour.stepUtils.statusbarButtonsSteps('Mark as Done', _t("Mark as Done"), ".o_statusbar_status .btn.dropdown-toggle:contains('To Close')"),
{
    edition: "enterprise",
    trigger: '.o_menu_toggle',
    content: _t('Go back to the home menu'),
    position: 'bottom',
},
...tour.stepUtils.goToAppSteps('sale.sale_menu_root', _t('Organize your sales activities with the <b>Sales app</b>.')),
tour.stepUtils.openBuggerMenu("li.breadcrumb-item.active:contains('Quotations')"),
{
    trigger: ".o_menu_sections a[data-menu-xmlid='sale.sale_order_menu']",
    content: _t("Go to Sales menu"),
    position: "bottom"
}, {
    trigger: ".o_menu_sections a[data-menu-xmlid='sale.menu_sale_order']",
    content: _t("Go to the sales orders"),
    position: "bottom"
}, {
    mobile: false,
    trigger: ".o_data_row:first",
    extra_trigger: '.o_control_panel .breadcrumb:contains("Sales Orders")',
    content: _t("Go to the last sale order"),
    position: "right"
}, {
    mobile: true,
    trigger: ".o_kanban_record:first",
    extra_trigger: '.o_control_panel .breadcrumb:contains("Sales Orders")',
    content: _t("Go to the last sale order"),
    position: "bottom"
},
tour.stepUtils.mobileModifier(tour.stepUtils.autoExpandMoreButtons('.o_control_panel .breadcrumb:contains("S0")')),
{
    mobile: false,
    trigger: '.oe_button_box .oe_stat_button:has(div[name=tasks_count])',
    content: _t('See Tasks'),
    position: 'right',
}, {
    mobile: true,
    trigger: '.oe_button_box .oe_stat_button:has(div[name=tasks_count])',
    extra_trigger: '.o_control_panel .breadcrumb:contains("S0")',
    content: _t('See Tasks'),
    position: 'bottom',
}, {
    trigger: '.o_field_widget[name=project_id]',
    content: _t('See Project'),
    position: 'right',
},
tour.stepUtils.mobileModifier(tour.stepUtils.autoExpandMoreButtons('.o_control_panel .breadcrumb:contains("the_flow.project")')),
{
    trigger: '.oe_button_box .oe_stat_button:has(span:contains("Timesheets"))',
    extra_trigger: '.o_form_readonly',
    content: _t('See Timesheets'),
    position: 'bottom',
}, {
    trigger: '.o_list_button_add',
    content: _t('Add a Timesheet'),
    position: 'bottom',
}, {
    // FIXME replace list by kanban + form
    trigger: '.o_selected_row input[name=name]',
    content: _t('Set description'),
    position: 'bottom',
    run: 'text 10 hours',
}, {
    trigger: '.o_selected_row .o_field_widget[name=task_id] input',
    content: _t('Choose a task'),
    position: 'bottom',
    run: 'click',
}, {
    mobile: false,
    trigger: ".ui-menu-item > a",
    auto: true,
}, {
    mobile: true,
    trigger: ".o_kanban_record .o_kanban_record_title :contains('the_flow.service')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Task')",
    content: _t("Select the the_flow.vendor"),
    position: "bottom",
}, {
    trigger: '.o_selected_row input[name=unit_amount]',
    content: _t('Set time'),
    position: 'bottom',
    run: 'text 10',
}, {
    trigger: '.o_list_button_save',
    content: _t('Save'),
    position: 'bottom',
},
...tour.stepUtils.goBackBreadcrumbsMobile(
        _t('Back to the sale order'),
        undefined,
        ".breadcrumb-item.active:contains('the_flow.project')",
        ".breadcrumb-item.active:contains('the_flow.service')"
    ),
{
    mobile: false,
    trigger: '.breadcrumb-item:nth-child(2) a',
    extra_trigger: '.o_list_button_add', // Waiting save
    content: _t('Back to the sale order'),
    position: 'bottom',
},
...tour.stepUtils.statusbarButtonsSteps('Create Invoice', _t("Validate"), ".o_field_widget[name=order_line]"),
{
    trigger: ".modal-footer .btn-primary",
    content: _t("Create and View Invoices"),
    position: "bottom",
},
...tour.stepUtils.statusbarButtonsSteps('Post', _t("Validate"), ".breadcrumb-item.active:contains('Draft Invoice')"),
...tour.stepUtils.statusbarButtonsSteps('Register Payment', _t("Register Payment"), ".breadcrumb-item.active:contains('INV/')"),
{
    trigger: ".modal-footer .btn-primary",
    content: _t("Validate"),
    position: "bottom",
}, {
    edition: "enterprise",
    trigger: '.o_menu_toggle',
    content: _t('Go back to the home menu'),
    position: 'bottom',
}, {
    edition: "enterprise",
    trigger: '.o_app[data-menu-xmlid="account_accountant.menu_accounting"]',
    content: _t('Go to Accounting'),
    position: 'bottom',
}, {
    edition: "enterprise",
    trigger: 'button[data-name=action_configure_bank_journal]',
    content: _t('Configure Bank Journal'),
    position: 'bottom',
}, {
    edition: "enterprise",
    trigger: '.js_configure_manually',
    content: _t('Enter manual data for bank account'),
    position: 'bottom',
}, {
    edition: "enterprise",
    trigger: ".o_field_widget[name=acc_number]",
    content: _t("Enter an account number"),
    position: "right",
    run: "text 867656544",
}, {
    trigger: ".modal-footer .btn-primary",
    content: _t('Save'),
    position: 'bottom',
}, {
    edition: "enterprise",
    trigger: 'div[name=bank_statement_create_button] > a[data-name=create_bank_statement], div[name=bank_statement_create_button] > a[data-name=create_bank_statement]',
    content: _t('Create a new bank statement'),
    position: 'bottom',
}, {
    edition: "enterprise",
    trigger: 'input[name=name]',
    content: _t("Let's enter the reference."),
    position: 'left',
    run: 'text the_flow.statement',
}, {
    edition: "enterprise",
    trigger: ".o_field_widget[name=balance_end_real] input",
    content: _t("Let's calculate the ending balance."),
    position: 'right',
    run: 'text 9955.87',
}, {
    // FIXME convert list in kanban + form
    edition: "enterprise",
    trigger: ".o_field_widget[name=line_ids] .o_field_x2many_list_row_add > a",
    content: _t("Click here to add some lines."),
    position: "bottom",
}, {
    edition: "enterprise",
    trigger: ".o_selected_row .o_field_widget[name=amount] input",
    content: _t("Write the amount received."),
    position: "bottom",
    run: "text 11.00",
}, {
    mobile: false,
    edition: "enterprise",
    trigger: ".o_selected_row .o_field_widget[name=partner_id] input",
    content: _t("Write the name of your customer."),
    position: "bottom",
    run: "text the_flow.customer",
}, {
    mobile: false,
    edition: "enterprise",
    trigger: ".ui-menu-item > a:contains('the_flow.customer')",
    in_modal: false,
    auto: true,
}, {
    mobile: true,
    edition: "enterprise",
    trigger: ".o_selected_row .o_field_widget[name=partner_id] input",
    content: _t("Write the name of your customer."),
    position: "bottom",
}, {
    mobile: true,
    trigger: ".o_kanban_record .o_kanban_record_title :contains('the_flow.customer')",
    extra_trigger: ".modal:not(.o_inactive_modal) .modal-title:contains('Partner')",
    content: _t('Save'),
    position: 'right',
}, {
    edition: "enterprise",
    trigger: ".o_selected_row .o_field_widget[name=payment_ref]",
    content: _t("Let's enter a name."),
    position: "bottom",
    run: "text the_flow.statement.line",
}, {
    edition: "enterprise",
    trigger: '.o_form_button_save',
    content: _t('Save.'),
    position: 'bottom',
},
...tour.stepUtils.statusbarButtonsSteps('Post', _t('Processing'), ".breadcrumb-item.active:contains('the_flow.statement')").map(tour.stepUtils.editionEnterpriseModifier),
...tour.stepUtils.statusbarButtonsSteps('Reconcile', _t('Reconcile'), ".o_statusbar_status .btn.dropdown-toggle:contains(Processing)").map(tour.stepUtils.editionEnterpriseModifier),
{
    edition: "enterprise",
    trigger: "button.o_reconcile, button.o_validate",
    content: _t('<p><b>Click on Reconcile</p>'),
    position: "right",
}, {
    edition: "enterprise",
    trigger: ".button_back_to_statement",
    content: _t('<p><b>Close this statement.</p>'),
    position: "bottom",
}]);
});
